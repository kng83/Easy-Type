import express from "express";
import txt from './Text_Files/alpha.txt';
import content from './Gql_Files/first.gql';
import {ApolloServer,gql} from 'apollo-server-express';
import uuidv4 from 'uuid/v4';
//Technical separation
const app = express();

const typeDefs = gql(content);

let users = {
  1: {
    id: '1',
    username: 'Bobo the kot',
    firstName:'bobo',
    lastName:'kot',
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'Some bill',
    firstName:'bill',
    lastName:'Some',
    messageIds: [1]
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};


const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      console.log(me)
      return me;
    },
    users:() => {
      console.log('userQuery', Object.values(users))
      return Object.values(users)
    },
    //tu jest wazne bo bierzemy id
    user: (parent ,{id},context) => {
      console.log('main',id,context)
      return users[id]
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      console.log('MAIN',id)
      return messages[id];
    },
  },
  Message: {
      user: message => {
      return users[message.userId];
    },
  },
  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
    //to robi balagan i wszystko nadpisuje ///
    //username: () => 'Hans',
    username: parent => {
      console.log('USERNAME',parent.username)
      return parent.username
    },
    fullName: user => {
      console.log('FULLNAME',user)
      return `${user.firstName} ${user.lastName}`
    }
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = { 
        id,
        text,
        userId: me.id,
      };
      //dla efektu
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      console.log(id)
      if (!messages[id]) {
        return false;
      }

      delete messages[id]
  
      return true;
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers:resolvers,
  context:{
    me:users[1]
  }
});

server.applyMiddleware({app});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)