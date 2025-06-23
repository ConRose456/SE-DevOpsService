import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { MutationSignInArgs } from "../../generated/graphqlTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signInResolver = async (
  _source: any,
  args: MutationSignInArgs,
  context: Context,
  _info: GraphQLResolveInfo,
) => {
  const { username, password } = args;

  const data = await context.dataSources.auth.fetchUserDocument({ username });

  const { document } = data;

  if (!document) {
    console.log(
      `[FAILED LOGIN] User: ${username} at ${new Date().toISOString()} - User not found`,
    );
    throw new Error("Invalid credentials");
  }

  const isPassValid = await verifyPassword(password, document.password);
  if (isPassValid) {
    const user = {
      userId: document.username,
      email: document.email,
      isAdmin: document.isAdmin,
    };

    const token = jwt.sign(
      {
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    if (context.req) {
      context.res.cookie("bw-jwt-auth-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        path: "/",
      });
    } else {
      console.log("Lambda");
    }

    return { token };
  }

  console.log(
    `[FAILED LOGIN] User: ${username} at ${new Date().toISOString()} - Invalid Password`,
  );
  throw new Error("Invalid credentials");
};

async function verifyPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}
