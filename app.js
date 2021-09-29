const express = require('express');


const app = express();

app.set('view engine','ejs');
app.set('views','./view');

app.use('/',require('./routes'))

app.listen(3030,()=>{
    console.log("server running");
})
