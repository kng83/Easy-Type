import express from "express";
import txt  from './Text_Files/alpha.txt';
import content from './Gql_Files/first.gql';
import {ApolloServer, gql} from 'apollo-server';

const some ='some'

const typeDefs = gql(content);

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world is mine',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then((s) => {
  console.log(`Server ready at ${s.url}`);
});