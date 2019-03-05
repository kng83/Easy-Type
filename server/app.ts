import cors from 'cors';
import express from "express";
import {ApolloServer} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();


const server = new ApolloServer({
  typeDefs:schema,
  resolvers:resolvers,
  context:{
    models,
  }
});

// const server = new ApolloServer({
//   typeDefs:schema,
//   resolvers:resolvers,
//   context:{
//     models,
//     me:models.users[1]
//   }
// });


server.applyMiddleware({app});

const eraseDatabaseOnSync = true;

sequelize.sync().then(async ()=>{
  app.listen({ port: 4000 }, () =>console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
})

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',      
    }
  );

  await models.User.create(
    {
      username: 'ddavids',    
    },
  );
};