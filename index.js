const express = require('express');
const port = 8000;

const app = express();


app.listen(port, (err)=>{
    if(err) {
        console.log(`Error is starting the server ${err} on ${port}`);
        return;
    }
    console.log(`Server started on ${port}`);
})