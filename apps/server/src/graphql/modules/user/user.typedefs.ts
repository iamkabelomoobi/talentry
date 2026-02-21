import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  extend type Query {
    hello: String
  }
`;
