import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { createContext } from "@/app/context";
import { config } from "@/infra/config";
import { connectDatabase, disconnectDatabase } from "@/infra/prisma";
import { authMiddleware } from "@/auth";
import { resolvers, typeDefs } from "@/graphql";
import { logger } from "@/infra/logger";
import ip from "ip";

type ServerRuntime = {
  start: () => Promise<void>;
  stop: (reason?: string) => Promise<void>;
};

export const createServerRuntime = async (): Promise<ServerRuntime> => {
  await connectDatabase();

  const app = express();
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, { context: createContext }),
  );

  app.all("/api/auth", authMiddleware);
  app.all("/api/auth/*", authMiddleware);

  let stopping = false;

  const stop = async (reason = "shutdown"): Promise<void> => {
    if (stopping) {
      return;
    }

    stopping = true;
    logger.info(`[server] ${reason} received, shutting down.`);

    await apolloServer.stop();
    await disconnectDatabase();

    await new Promise<void>((resolve, reject) => {
      httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  };

  const start = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      httpServer.listen({ port: config.server.port }, () => {
        logger.info({
          message: "Server is running 🚀",
          host: ip.address(),
          port: config.server.port,
        });
        resolve();
      });
    });
  };

  return { start, stop };
};
