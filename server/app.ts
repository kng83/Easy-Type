import cors from 'cors';
import express from "express";
import {ApolloServer} from 'apollo-server-express';

import models from './models'
import schema from './schema';
import resolvers from './resolvers';
//Technical separation
const app = express();




const server = new ApolloServer({
  typeDefs:schema,
  resolvers:resolvers,
  context:{
    models,
    me:models.users[1]
  }
});

server.applyMiddleware({app});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)