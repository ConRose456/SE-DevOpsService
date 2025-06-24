import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./generated/combined.graphql";
import resolvers from "./resolvers";
import { dataSources } from "./dataSources";
import { context, globalCookie } from "./context";

const foo = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
}).createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      credentials: true,
      origin: "https://d1bp0xz6hl332p.cloudfront.net",
    },
  },
});

export const handler = async (event, context, callback) => {
  console.log(`[Query] - ${event.body}`);
  const response = await foo(event, context, callback);

  const cookie = globalCookie.value;
  globalCookie.value = "";

  return {
    ...response,
    statusCode: 200,
    headers: {
      ...(response.headers || {}),
      "Set-Cookie": cookie.length ? cookie : undefined,
      "Access-Control-Allow-Origin": "https://d1bp0xz6hl332p.cloudfront.net",
      "Access-Control-Allow-Credentials": "true",
    },
  };
};
