import express from "express";
import txt  from './Text_Files/alpha.txt';
import content from './Gql_Files/first.gql';
import {ApolloServer, gql} from 'apollo-server';

import * as tedious from 'tedious'
const Connection = tedious.Connection;

  var config = {
    server: "mssq",
    options: {encrypt: true},
    authentication: {
      type: "default"
  }
}

  const connection = new Connection(config);

  connection.on('connect', (err) => {
      executeStatement();
    }
  );

  function executeStatement() {
   let request = new Request("select 42, 'hello world'");
  }


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