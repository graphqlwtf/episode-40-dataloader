import { createServer } from "@graphql-yoga/node";
import * as DataLoader from "dataloader";

type User = {
  id: string;
  name: string;
  bestFriendId: string;
};

const users: User[] = [
  {
    id: "1",
    name: "Jamie",
    bestFriendId: "2",
  },
  {
    id: "2",
    name: "Laurin",
    bestFriendId: "3",
  },
  {
    id: "3",
    name: "Saihaj",
    bestFriendId: "2",
  },
];

const getUserById = (id: string): User => {
  console.log(`Calling getUserById for id: ${id}`);

  return users.find((d) => d.id === id);
};

const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  return ids.map((id) => getUserById(id));
};

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
  }

  type User {
    id: ID!
    name: String!
    bestFriend: User!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
  User: {
    bestFriend: async ({ bestFriendId }) => {
      const user = await getUserById(bestFriendId);

      return user;
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  context: () => ({
    userLoader: new DataLoader(getUsersByIds),
    // userLoader: new DataLoader(ids => getUsersByIds(ids, authorizationToken)),
  }),
});

server.start();
