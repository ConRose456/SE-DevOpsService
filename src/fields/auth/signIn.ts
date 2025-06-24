import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { MutationSignInArgs } from "../../generated/graphqlTypes";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { createJwtToken } from "./signUp";

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

    const token = await createJwtToken(
      { userId: user.userId, isAdmin: user.isAdmin },
      context,
    );

    console.log(
      `[SIGN IN ATTEMPT] User: ${username} at ${new Date().toISOString()} - has signed in.`,
    );
    return token;
  }

  console.log(
    `[FAILED LOGIN] User: ${username} at ${new Date().toISOString()} - Invalid Password`,
  );
  throw new Error("Invalid credentials");
};

const scryptAsync = promisify(scrypt);

async function verifyPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = (await scryptAsync(plainPassword, salt, 64)) as Buffer;
  return timingSafeEqual(keyBuffer, derivedKey);
}
