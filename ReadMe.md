# GraphQL


## Commands
```
npm init
npm install express express-graphql graphql
npm i --save-dev nodemon
```


## GraphQL Commands
```
query {
  message
}



{
  books {
    authorId,
    name
  }
}



{
  books {
    id,
    name,
    author {
      name,
      id
    }
  }
}


{
  authors {
    id,
    books {
      id,
      name
    }
  }
}


To find book by id
{
  book(id:1) {
    name
  }
}


To add a book
mutation {
  addBook(name:"Harry Potter And the Order of Pheonix", authorId:1) {
    name,
    id
  }
}
```
