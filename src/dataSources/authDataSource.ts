import { DataSource } from "apollo-datasource";
import { DynamoDbClient } from "./dynamoDbClient";

export type UserId = {
    username: string
}

export interface IAuthDataSource {
    fetchUserDocument: (id: UserId) => any;
}

export class AuthDataSource extends DataSource implements IAuthDataSource {
    private dynamoDbClient: DynamoDbClient;

    constructor() {
        super();
        this.dynamoDbClient = new DynamoDbClient(`${process.env.STAGE}-User`);
    }

    fetchUserDocument = async ({ username }: UserId) => {
        const response = await this.dynamoDbClient.fetchItem(username);
        return {
            ...response,
            document: response.document ? JSON.parse(response.document) : undefined
        };
    }
}