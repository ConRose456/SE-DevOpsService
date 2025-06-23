import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { MutationSignInArgs } from "../../generated/graphqlTypes";
import jwt from "jsonwebtoken";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

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

const scryptAsync = promisify(scrypt);

async function verifyPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
    console.log("Verify");
  const [salt, key] = hash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = (await scryptAsync(plainPassword, salt, 64)) as Buffer;
  return timingSafeEqual(keyBuffer, derivedKey);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

hashPassword("fake-password").then(console.log)
