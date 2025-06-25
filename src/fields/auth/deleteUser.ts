import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Context } from "../../context";
import { MutationDeleteUserArgs } from "../../generated/graphqlTypes";
import { GraphQLResolveInfo } from "graphql";

export const deleteUserResolver = async (
  source: any,
  args: MutationDeleteUserArgs,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();
  const { userId, isAdmin } = isAuthed?.decoded ?? {
    userId: "",
    isAdmin: false,
  };

  if (userId?.length && isAdmin) {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const key = { ".partitionKey": args.id };
    try {
      const command = new DeleteCommand({
        TableName: `${process.env.STAGE}-User`,
        Key: { ".partitionKey": args.id },
      });

      await docClient.send(command);
      console.log("Item deleted:", key);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete item:", error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
  console.log(
    `[UNAUTHORISED ACCESS ATTEMPT] - ${userId?.length ? "User " + userId : "An unknown user"} has attempted to modify other users data.`,
  );
  return { success: false };
};
