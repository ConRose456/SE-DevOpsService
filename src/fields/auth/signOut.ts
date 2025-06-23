import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";

export const signOutResolver = async (
  source,
  args,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const auth = context.isAuthed();
  const userId = auth.decoded?.userId ?? "";

  if (context.res) {
    context.res.cookie("bw-jwt-auth-token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
      path: "/",
    });
    console.log(
      `[Signed Out] - User ${userId}, signed out - ${new Date().toISOString()}.`,
    );
    return { success: true };
  }
  console.log(
    `[Failed to Sign Out] - User ${userId}, sign out request failed.`,
  );
  return { success: false };
};
