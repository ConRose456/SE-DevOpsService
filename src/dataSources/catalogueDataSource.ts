import { DataSource } from "apollo-datasource";
import { DynamoDbClient } from "./dynamoDbClient";

type CatalogueId = {
  id: string;
  field: string;
};

type CatalogueData = {
  id: string;
  document: any;
  timestamp?: number;
};

export interface ICatalogueDataSource {
  fetchCatalogueDocument(catalogueId: CatalogueId): Promise<CatalogueData>;
  batchFetchCatalogueDocuments(
    catalogueIds: Array<CatalogueId>,
  ): Promise<Array<CatalogueData>>;
  writeCatalogueDocument(
    catalogueId: CatalogueId,
    document: any,
  ): Promise<boolean>;
}

export class CatalogueDataSource
  extends DataSource
  implements ICatalogueDataSource
{
  private dynamoDbClient: DynamoDbClient;

  constructor() {
    super();
    this.dynamoDbClient = new DynamoDbClient(`${process.env.STAGE}-Catalogue`);
  }

  public fetchCatalogueDocument = async (catalogueId: CatalogueId) => {
    return await this.batchFetchCatalogueDocuments([catalogueId]).then((res) =>
      res?.length ? res[0] : undefined,
    );
  };

  public batchFetchCatalogueDocuments = async (
    catalogueIds: Array<CatalogueId>,
  ): Promise<Array<CatalogueData>> => {
    const responses = await this.dynamoDbClient.batchGetItems(
      catalogueIds.map(toCatalogueKey),
    );
    return responses
      .map((response) => ({
        ...response,
        document: response.document ? JSON.parse(response.document) : undefined,
      }))
      .filter((document) => document.document) as Array<CatalogueData>;
  };

  public writeCatalogueDocument = async (
    catalogueId: CatalogueId,
    document: Record<string, unknown>,
  ): Promise<boolean> => {
    const key = toCatalogueKey(catalogueId);
    return await this.dynamoDbClient
      .putItem(key, document)
      .then(() => true)
      .catch((error) => {
        console.log(`[Error] - Failed to write ${catalogueId}`);
        return false;
      });
  };
}

export class StubCatalogueDataSource
  extends DataSource
  implements ICatalogueDataSource
{
  private stubs = new Map<string, string>();

  public clear = () => this.stubs.clear();

  public stubCatalogueDocument = (catalogueId: CatalogueId, data: string) => {
    this.stubs.set(toCatalogueKey(catalogueId), data);
  };

  public fetchCatalogueDocument = async (
    catalogueId: CatalogueId,
  ): Promise<CatalogueData> =>
    await this.batchFetchCatalogueDocuments([catalogueId]).then(
      (res) => res[0],
    );

  public batchFetchCatalogueDocuments = async (
    catalogueIds: Array<CatalogueId>,
  ): Promise<Array<CatalogueData>> =>
    catalogueIds
      .map((id) => ({
        id: toCatalogueKey(id),
        document: this.stubs.has(toCatalogueKey(id))
          ? JSON.parse(this.stubs.get(toCatalogueKey(id)))
          : undefined,
      }))
      .filter((document) => document.document);

  public writeCatalogueDocument(catalogueId: CatalogueId, document: any) {
    return Promise.resolve(false);
  }
}

const toCatalogueKey = (catalogueId: CatalogueId) =>
  `${catalogueId.field}|${catalogueId.id}`;
