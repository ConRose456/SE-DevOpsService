import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";

export const getAllUsersResolver = async (
  source,
  args,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();
  const { userId, isAdmin } = isAuthed?.decoded ?? {
    userId: "",
    isAdmin: false,
  };

  if (userId?.length && isAdmin) {
    const data = await context.dataSources.auth.getAllUsers();
    return data.map(({ document }) => ({
      username: document.username,
      isAdmin: document.isAdmin,
    }));
  }
  console.log(
    `[UNAUTHORISED ACCESS ATTEMPT] - ${userId?.length ? "User " + userId : "An unknown user"} has attempted to access other users data.`,
  );
  throw Error("[UNAUTHORISED] - User not authorised");
};

export default {
  isAuthed: {
    allUsers: getAllUsersResolver,
  },
};
