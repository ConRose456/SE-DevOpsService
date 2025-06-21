import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./generated/combined.graphql";
import resolvers from "./resolvers";
import { dataSources } from "./dataSources";

export const handler = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  introspection: true,
}).createHandler();
