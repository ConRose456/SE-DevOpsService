import {
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  DynamoDBClient,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { gunzipSync } from "zlib";

export class DynamoDbClient {
  private tableName: string;
  private docClient: DynamoDBDocumentClient;

  constructor(tableName: string, config?: DynamoDBClientConfig) {
    this.tableName = tableName;
    const client = new DynamoDBClient({
      region: "eu-west-2",
      ...config,
    });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async batchGetItems(
    keys: Array<string>,
    tableNameOverride?: string,
  ): Promise<Record<string, any>[]> {
    const requestItems: Record<string, any> = {
      [tableNameOverride ?? this.tableName]: {
        Keys: keys.map((key) => ({ ".partitionKey": { S: key } })),
      },
    };

    const input: BatchGetItemCommandInput = {
      RequestItems: requestItems,
    };

    try {
      const command = new BatchGetItemCommand(input);
      const response = await this.docClient.send(command);

      // Check if there are unprocessed items, which might require retrying
      if (
        response.UnprocessedKeys &&
        Object.keys(response.UnprocessedKeys).length > 0
      ) {
        console.warn("Some keys were not processed:", response.UnprocessedKeys);
      }

      const items =
        response.Responses?.[tableNameOverride ?? this.tableName] ?? [];

      return items.map((item) => ({
        id: item[".partitionKey"].S,
        document: gunzipSync(Buffer.from(item.document.S, "base64")).toString(
          "utf-8",
        ),
        timestamp: item.timestamp.N,
      }));
    } catch (error: any) {
      console.error("DynamoDB BatchGetItem failed:", error.name, error.message);
      throw new Error("Failed to batch fetch items from DynamoDB");
    }
  }
}
