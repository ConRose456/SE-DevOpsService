import {
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  DynamoDBClient,
  DynamoDBClientConfig,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { timeStamp } from "console";
import { promisify } from "util";
import { gunzipSync, gzip } from "zlib";

const gzipAsync = promisify(gzip);

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

  async fetchItem(key: string, tableNameOverride?: string) {
    return await this.batchGetItems([key], tableNameOverride).then(
      (res) => res[0],
    );
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

  public scanItems = async () => {
    let items: any[] = [];
    let ExclusiveStartKey: Record<string, any> | undefined;

    try {
      do {
        const command = new ScanCommand({
          TableName: this.tableName,
          ExclusiveStartKey,
        });

        const response = await this.docClient.send(command);

        if (!response || !response.Items) {
          console.warn(`Empty response received for table ${this.tableName}`);
          break;
        }

        items = items.concat(response.Items);
        ExclusiveStartKey = response.LastEvaluatedKey;
      } while (ExclusiveStartKey);

      return items.map((item) => ({
        id: item[".partitionKey"].S,
        document: gunzipSync(Buffer.from(item.document.S, "base64")).toString(
          "utf-8",
        ),
        timestamp: item.timestamp.N,
      }));
    } catch (error: any) {
      console.error(`Failed to scan table ${this.tableName}:`, error);
      throw new Error(`DynamoDB scan failed: ${error.message}`);
    }
  };

  public putItem = async (
    key: string,
    document: Record<string, unknown>,
  ): Promise<void> => {
    const gzip = await gzipAsync(JSON.stringify(document));
    const base64 = gzip.toString("base64");

    const item = {
      ".partitionKey": key,
      document: base64,
      timestamp: new Date().toISOString(),
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
  };
}
