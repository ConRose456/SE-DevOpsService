process.env.STAGE = "Beta";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import resolvers from "../resolvers";
import { readFileSync } from "fs";
import path from "path";
import gql from "graphql-tag";
import { dataSources } from "../dataSources";

function graphqlLoader(filePath: string) {
  const content = readFileSync(path.resolve(filePath), "utf8");
  return gql(content);
}

const typeDefs = graphqlLoader("./src/generated/combined.graphql");

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async () => ({ dataSources: dataSources() }),
    }),
  );

  app.listen({ port: 4000 }, () =>
    console.log("🚀 Server ready at http://localhost:4000/graphql"),
  );
}

startServer();
