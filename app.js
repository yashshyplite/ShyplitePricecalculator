const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session")
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// Creating session
app.use(cookieParser());
app.use(session({
	key: "user_id",
	secret: "secret", // Secret key,
	saveUninitialized: false,
	resave: false,
	cookie:{
        maxAge: 1000*60*60*2
    }
}))

app.set('view engine','ejs');
app.set('views','./view');

require('./bootstrap/bootstrap');

app.use('/',require('./routes'))

app.listen(3030,()=>{
    console.log("server running");
})
