import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./generated/combined.graphql";
import resolvers from "./resolvers";

export const handler = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
}).createHandler();
