import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import cors from 'cors';
import resolvers from './resolvers.js';
import db from './database/dbPrepare.js';

const app=express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

/**
 * Init the db
 */
db.serialize(() => {
    db.run("CREATE TABLE task (id TEXT,description TEXT,completed BOOLEAN)");
});


const typeDefs=readFileSync('./src/schema.graphql','utf-8')

const PORT:number|string=3000||process.env.PORT;

const graphqlServer=new ApolloServer({typeDefs, resolvers});

await graphqlServer.start()

app.use('/gql',expressMiddleware(graphqlServer))

app.listen(PORT,()=>{
    console.log("Server started at port 3000")
})