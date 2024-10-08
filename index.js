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

let authors = [
  { id: 1, name: "JK Rowling" },
  { id: 2, name: "J R R Tolkein" },
  { id: 3, name: "Brent Weeks" },
];

let books = [
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
    books: {
      // books is not a field in books schema
      type: new GraphQLList(BookType),
      resolve: (parent = author) => {
        return books.filter((book) => book.authorId === parent.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      // author is not a field in books schema
      type: AuthorType,
      resolve: (parent = book) => {
        return authors.find((author) => author.id === parent.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return books.find((book) => book.id === args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id);
      },
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType, // return type
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuhor: {
      type: AuthorType, // return type
      description: "Add author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      },
    },
    updateBook: {
      type: new GraphQLList(BookType),
      description: "Updating a book by id",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        books.filter((book) => {
          if (book.id === args.id) {
            book.name = args.name;
          }
        });
        return books;
      },
    },
    deleteBook: {
      type: new GraphQLList(BookType),
      description: "Deleting a book by id",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const deletedBook = books.filter((book) => book.id === args.id);
        books = books.filter((book) => book.id !== args.id);
        return books;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

//middleware
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
