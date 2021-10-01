require('dotenv').config();
const mysql = require('mysql');

//create connection 
global.db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT
});

db.connect(err=>{
    if(err){
        throw err;
    }
    console.log("connected");
});

module.exports=db;