import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./generated/combined.graphql";
import resolvers from "./resolvers";
import { dataSources } from "./dataSources";
import { context } from "./context";

export const handler = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
}).createHandler();
