import { createServer } from "@graphql-yoga/node";
import * as DataLoader from "dataloader";

type Domain = {
  id: string;
  name: string;
  expires: string;
  owner: string;
};

const domains: Domain[] = [
  {
    id: "1",
    name: "notrab.eth",
    expires: "today",
    owner: "Jamie",
  },
  {
    id: "2",
    name: "graphql.eth",
    expires: "tomorrow",
    owner: "Jamie",
  },
];

const getDomainById = (id: string): Domain => {
  console.log(`Calling getDomainById for id: ${id}`);

  return domains.find((d) => d.id === id);
};

const getDomainByIds = async (ids: string[]): Promise<Domain[]> => {
  return ids.map((id) => getDomainById(id));
};

const typeDefs = /* GraphQL */ `
  type Query {
    domain(id: ID!): Domain!
    domains: [Domain!]!
  }

  type Domain {
    id: ID!
    name: String!
    expires: String!
    owner: String!
  }
`;

const resolvers = {
  Query: {
    domain: (_, { id }) => ({ id }),
    domains: () => domains.map((d) => ({ id: d.id })),
  },
  Domain: {
    name: async ({ id }, _, { domainLoader }) => {
      const { name } = await domainLoader.load(id);

      return name;
    },
    expires: async ({ id }, _, { domainLoader }) => {
      const { expires } = await domainLoader.load(id);

      return expires;
    },
    owner: async ({ id }, _, { domainLoader }) => {
      const { owner } = await domainLoader.load(id);

      return owner;
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  context: {
    domainLoader: new DataLoader(getDomainByIds),
  },
});

server.start();
