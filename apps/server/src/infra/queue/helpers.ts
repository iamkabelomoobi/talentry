import { enqueueJob } from "@/infra/queue/client";
import { QueueJobName, QueueJobOptions } from "@/infra/queue/types";

export const createJobEnqueuer = <TPayload>(jobName: QueueJobName) => {
  return async (payload: TPayload, options?: QueueJobOptions): Promise<void> => {
    await enqueueJob({ name: jobName, payload, options });
  };
};
