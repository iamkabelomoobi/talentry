import { disconnectDatabase } from "@/infra/prisma";
import { createServerRuntime } from "@/app/server";

export const bootstrapServer = async (): Promise<void> => {
  const runtime = await createServerRuntime();

  const handleSignal = (signal: NodeJS.Signals) => {
    void runtime.stop(signal).finally(() => {
      process.exit(0);
    });
  };

  process.once("SIGINT", () => {
    handleSignal("SIGINT");
  });
  process.once("SIGTERM", () => {
    handleSignal("SIGTERM");
  });

  await runtime.start();
};

export const startServer = async (): Promise<void> => {
  try {
    await bootstrapServer();
  } catch (error) {
    console.error("Failed to start server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
};
