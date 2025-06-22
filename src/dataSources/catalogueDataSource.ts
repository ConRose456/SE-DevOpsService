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
  fetchCatalogueDocument(
    catalogueId: CatalogueId,
  ): Promise<Array<CatalogueData>>;
  batchFetchCatalogueDocuments(
    catalogueIds: Array<CatalogueId>,
  ): Promise<Array<CatalogueData>>;
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
    return await this.batchFetchCatalogueDocuments([catalogueId])[0];
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
  ): Promise<Array<CatalogueData>> =>
    await this.batchFetchCatalogueDocuments([catalogueId]);

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
}

const toCatalogueKey = (catalogueId: CatalogueId) =>
  `${catalogueId.field}|${catalogueId.id}`;
