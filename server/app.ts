import express from "express";
import txt from './Text_Files/alpha.txt';
import content from './Gql_Files/first.gql';
import {ApolloServer,gql} from 'apollo-server-express';

const app = express();

const typeDefs = gql(content);

let users = {
  1: {
    id: '1',
    username: 'Bobo the kot',
  },
  2: {
    id: '2',
    username: 'Some bill',
  },
};


const resolvers = {
  Query: {
    me: () => {
      console.log('me query')
      return {       
        username: 'Pawel Keng',
      };
    },
    users:() => {
      console.log('userQuery', Object.values(users))
      return Object.values(users)
    },
    //tu jest wazne bo bierzemy id
    user: (parent ,{id}) => {
      console.log('main',id)
      return users[id]
    },
  },
  User: {
    //to robi balagan i wszystko nadpisuje
    //username: () => 'Hans',
    username: parent => {
      console.log('USER',parent)
      return parent.username
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers:resolvers
});

server.applyMiddleware({app});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)