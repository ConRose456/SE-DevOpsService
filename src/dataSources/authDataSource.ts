import { DataSource } from "apollo-datasource";
import { DynamoDbClient } from "./dynamoDbClient";

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
}

export class AuthDataSource extends DataSource implements IAuthDataSource {
  private dynamoDbClient: DynamoDbClient;

  constructor() {
    super();
    this.dynamoDbClient = new DynamoDbClient(`${process.env.STAGE}-User`);
  }

  fetchUserDocument = async ({ username }: UserId): Promise<UserData> => {
    const response = await this.dynamoDbClient.fetchItem(username);
    return {
      ...response,
      document: response?.document ? JSON.parse(response.document) : undefined,
    } as UserData;
  };
}

export class StubAuthDataSource extends DataSource implements IAuthDataSource {
  private map: Map<string, string>;

  constructor() {
    super();
    this.map = new Map();
  }

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
