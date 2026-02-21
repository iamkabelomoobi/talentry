import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import { resolvers, typeDefs } from "./graphql";
import { createContext } from "@/context";
import { connectDatabase, disconnectDatabase } from "@/prisma/client";

async function bootstrap() {
  await connectDatabase();

  const app = express();
  const httpServer = http.createServer(app);
  const port = Number(process.env.PORT) || 4000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: createContext }),
  );

  const shutdown = async (signal: string) => {
    console.info(`${signal} received, shutting down.`);
    await disconnectDatabase();
    httpServer.close(() => {
      process.exit(0);
    });
  };

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  httpServer.listen({ port }, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server:", error);
  await disconnectDatabase();
  process.exit(1);
});
