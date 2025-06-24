import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { MutationSignInArgs } from "../../generated/graphqlTypes";
import jwt from "jsonwebtoken";
import { randomBytes, scryptSync } from "crypto";

export const signUpResolver = async (
  _source: any,
  args: MutationSignInArgs,
  context: Context,
  _info: GraphQLResolveInfo,
) => {
  const hashedPassword = hashPassword(args.password);
  const newUser = {
    username: args.username,
    password: hashedPassword,
    isAdmin: false,
  };

  const response = await context.dataSources.auth.createUser(
    args.username,
    newUser,
  );

  if (response?.alreadyExists) {
    return { alreadyExists: response.alreadyExists, token: "" };
  }

  const token = await createJwtToken(
    { userId: args.username, isAdmin: false },
    context,
  );

  console.log(
    `[SIGN UP ATTEMPT] User: ${args.username} at ${new Date().toISOString()} - has signed up.`,
  );
  return { ...token, alreadyExists: false };
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export const createJwtToken = async (
  { userId, isAdmin }: { userId: string; isAdmin: boolean },
  context,
) => {
  const secret =
    process.env.LOCAL_SECRET ??
    (await context.dataSources.auth.fetchJwtSecret());
  const token = jwt.sign(
    {
      userId,
      isAdmin,
    },
    secret,
    {
      expiresIn: "1h",
    },
  );

  if (context.event) {
    context.setCookie("bw-jwt-auth-token", token);
  } else if (context.res) {
    context.res.cookie("bw-jwt-auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return { token };
};
