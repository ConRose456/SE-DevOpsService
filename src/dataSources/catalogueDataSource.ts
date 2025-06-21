import { DataSource, DataSourceConfig } from "apollo-datasource";
import { DynamoDbClient } from "./dynamoDbClient";

type CatalogueId = {
  id: string;
  field: string;
};

type CatalogueData = {
  id: string;
  document: any;
  timestamp: number;
};

export class CatalogueDataSource extends DataSource {
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
      catalogueIds.map(this.toCataloguKey),
    );
    return responses.map((response) => ({
      ...response,
      document: JSON.parse(response.document),
    })) as Array<CatalogueData>;
  };

  private toCataloguKey = (catalogueId: CatalogueId) =>
    `${catalogueId.field}|${catalogueId.id}`;
}
