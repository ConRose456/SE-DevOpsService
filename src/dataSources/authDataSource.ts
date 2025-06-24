import { DataSource } from "apollo-datasource";
import { DynamoDbClient } from "./dynamoDbClient";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export type UserId = {
  username: string;
};

type UserData = {
  id: string;
  document: any;
  timestamp?: number;
};

export interface IAuthDataSource {
  fetchUserDocument: (id: UserId) => any;
  fetchJwtSecret: () => any;
}

export class AuthDataSource extends DataSource implements IAuthDataSource {
  private dynamoDbClient: DynamoDbClient;
  private secretsManager: SecretsManagerClient;

  constructor() {
    super();
    this.dynamoDbClient = new DynamoDbClient(`${process.env.STAGE}-User`);
    this.secretsManager = new SecretsManagerClient({
      region: "eu-west-2",
    });
  }

  fetchUserDocument = async ({ username }: UserId): Promise<UserData> => {
    const response = await this.dynamoDbClient.fetchItem(username);
    return {
      ...response,
      document: response?.document ? JSON.parse(response.document) : undefined,
    } as UserData;
  };

  fetchJwtSecret = async () => {
    const secretName = process.env.JWT_SECRET_NAME!;
    try {
      const res = await this.secretsManager.send(
        new GetSecretValueCommand({
          SecretId: secretName,
        }),
      );
      return JSON.parse(res.SecretString)?.password ?? "";
    } catch (error) {
      console.log("[Failed Fetch For Secret] Secret could not be found.");
      throw error;
    }
  };
}

export class StubAuthDataSource extends DataSource implements IAuthDataSource {
  private map: Map<string, string>;

  constructor() {
    super();
    this.map = new Map();
  }
  fetchJwtSecret = () => {};

  clear = () => this.map.clear();

  stubUserDocument = ({ username }: UserId, document: string) => {
    this.map.set(username, document);
  };

  fetchUserDocument = async ({ username }: UserId) => {
    const document = this.map.get(username);

    return {
      id: username,
      document: document ? JSON.parse(document) : undefined,
    };
  };
}
