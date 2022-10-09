import { ApolloServer, gql } from "apollo-sever";

const typeDefs = gql`
  type Query {
    greet: String
  }
`;

const resolvers = {
  Query: {
    greet: () => "HI NOON",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});
