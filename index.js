const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const port = 8000;
const {GraphQLSchema, GraphQLObjectType, GraphQLString} = require('graphql');
const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"helloworld",
        fields:()=>({
            message:{
                type:GraphQLString, 
                resolve: ()=>"hello world"
            }
        })
    })
});


app.use("/graphql", expressGraphQL({
    schema:schema,
    graphiql: true
}));

app.listen(port, (err)=>{
    if(err) {
        console.log(`Error is starting the server ${err} on ${port}`);
        return;
    }
    console.log(`Server started on ${port}`);
})