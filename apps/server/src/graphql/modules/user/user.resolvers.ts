import { getHelloMessage } from "./user.service";

export const userResolvers = {
  Query: {
    hello: () => getHelloMessage(),
  },
};
