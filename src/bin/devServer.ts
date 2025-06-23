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
import cookie from "cookie";
import jwt from "jsonwebtoken";
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

const allowListOrigins = [
  "http://localhost:3000",
  "https://studio.apollographql.com",
];

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowListOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Cors"));
      }
    },
    credentials: true,
  }),
);
app.use(bodyParser.json());

async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const cookies = cookie.parse(req.headers.cookie || "");
        return {
          res,
          req,
          isAuthed: isValidJWT(cookies["bw-jwt-auth-token"]),
          cookies: cookies,
          dataSources: dataSources(),
        };
      },
    }),
  );

  app.listen({ port: 4000 }, () =>
    console.log("🚀 Server ready at http://localhost:4000/graphql"),
  );
}

const isValidJWT = (token) => {
  return () => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { decoded };
    } catch (error) {
      console.log(
        "[Invalid Credenitals] - JWT is invalid or expired: ",
        JSON.stringify(error),
      );
      return {};
    }
  };
};

startServer();
