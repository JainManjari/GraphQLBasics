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
```
