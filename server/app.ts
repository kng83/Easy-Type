import cors from 'cors';
import express from "express";
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();


const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('pkeng'),
  })
});//

server.applyMiddleware({ app });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if(eraseDatabaseOnSync){
    createUsersWithMessages();
  }
  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
})

//const MessageTag = sequelize.define('message_tag', {});



const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'pkeng',
      messages: [
        {
          txt: 'some text',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ulrich von denka',
      messages: [
        {
          txt: 'is crazy ...',
        },
        {
          txt: 'im driving ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
