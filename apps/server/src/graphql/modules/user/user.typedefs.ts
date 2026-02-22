import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  enum UserRole {
    ADMIN
    SEEKER
    COMPANY
  }

  enum AdminType {
    SUPER_ADMIN
    COMPANY_ADMIN
  }

  type Admin {
    id: ID!
    type: AdminType!
    createdAt: String!
    updatedAt: String!
  }

  type Seeker {
    id: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Company {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    avatar: String
    image: String
    role: UserRole!
    emailVerified: Boolean!
    createdAt: String!
    updatedAt: String!
    admin: Admin
    seeker: Seeker
    company: Company
  }

  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    updateProfile(name: String, email: String, phone: String, avatar: String): User
    changePassword(currentPassword: String!, newPassword: String!): Boolean
    deleteAccount: Boolean
  }
`;