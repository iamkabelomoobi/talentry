import { gql } from "graphql-tag";
import { userResolvers, userTypeDefs } from "./modules/user";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
`;

type ResolverMap = Record<string, Record<string, unknown>>;

const mergeResolvers = (resolverMaps: ResolverMap[]): ResolverMap =>
  resolverMaps.reduce<ResolverMap>((merged, current) => {
    for (const [typeName, fields] of Object.entries(current)) {
      merged[typeName] = {
        ...(merged[typeName] ?? {}),
        ...fields,
      };
    }

    return merged;
  }, {});

export const typeDefs = [baseTypeDefs, userTypeDefs];

export const resolvers = mergeResolvers([userResolvers]);
