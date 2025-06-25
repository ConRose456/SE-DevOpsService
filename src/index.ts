import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./generated/combined.graphql";
import resolvers from "./resolvers";
import { dataSources } from "./dataSources";
import { context, globalCookie } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
}).createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      credentials: true,
      origin: process.env.CLOUDFRONT_DOMAIN!,
    },
  },
});

export const handler = async (event, context, callback) => {
  console.log(`[Query] - ${event.body}`);
  const response = await server(event, context, callback);

  const cookie = globalCookie.value;
  globalCookie.value = "";

  return {
    ...response,
    statusCode: 200,
    headers: {
      ...(response.headers || {}),
      "Set-Cookie": cookie.length ? cookie : undefined,
      "Access-Control-Allow-Origin": process.env.CLOUDFRONT_DOMAIN!,
      "Access-Control-Allow-Credentials": "true",
    },
  };
};
