const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const port = 8000;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const authors = [
  { id: 1, name: "JK Rowling" },
  { id: 2, name: "J R R Tolkein" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  { id: 1, name: "Harry Potter and Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and Globet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The way of shadows", authorId: 3 },
  { id: 8, name: "Beyond shadows", authorId: 3 },
];

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name:"helloworld",
//         fields:()=>({
//             message:{
//                 type:GraphQLString,
//                 resolve: ()=>"hello world"
//             }
//         })
//     })
// });

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author who has written books",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: { // author is not a field in books schema
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    authors:{
        type: new GraphQLList(AuthorType),
        description:"List of authors",
        resolve:()=>authors,
    }
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port, (err) => {
  if (err) {
    console.log(`Error is starting the server ${err} on ${port}`);
    return;
  }
  console.log(`Server started on ${port}`);
});
