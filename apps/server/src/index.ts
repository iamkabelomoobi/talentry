import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import { resolvers, typeDefs } from "./graphql";

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  httpServer.listen({ port: process.env.PORT || 4000 }, () => {
    console.log("Server ready at http://localhost:4000/graphql");
  });
}

bootstrap().catch(console.error);
