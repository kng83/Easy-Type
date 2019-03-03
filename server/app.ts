import express from "express";
import txt from './Text_Files/alpha.txt';
import content from './Gql_Files/first.gql';
import { ApolloServer, gql } from 'apollo-server';

import mssql from 'mssql'


let sql = mssql as any;

(async () => {
  try {
    await sql.connect('mssql://sa:12345@localhost:49714/Pyszczek'); //
    const result = await sql.query(
      `SELECT TOP 5
                [Name],[Age]
                FROM [Pyszczek].[dbo].[First]`);
    console.log(result.recordset);

    const second = await sql.query(
      `INSERT INTO [Pyszczek].[dbo].[First]
             VALUES ('Puszek',1);`
    )

  } catch (err) {
    // ... error checks
    console.log(err.message);//
  }
})();

const some = 'some'

const typeDefs = gql(content);

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world is mine',
    user(id)  {
      console.log(id)
      return {
        id:10,
        firstName: 'Pawel',
        lastName:'Keng',
        email:'test@test.pl'
      }
    }
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then((s) => {
  console.log(`Server ready at ${s.url}`);
});