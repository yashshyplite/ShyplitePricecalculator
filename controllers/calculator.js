const crypto = require("crypto");
const util = require('util');
require('dotenv').config();
const requesting = require('request');
const request = util.promisify(requesting);
const mysql = require('mysql');

const timestamp     = +new Date();
const key           = process.env.API_KEY;
const appID         = process.env.API_APPID; 
const sellerID      = process.env.API_SELLERID;
const secret        = new Buffer(process.env.API_SECRET);

const form =(req,res)=>{
   return res.render("index");
}

//request is a callback function so it need to be promisified
const generateAuth = () => {
    
    let sign = `key:${key}id:${appID}:timestamp:${timestamp}`
    let hash = crypto.createHmac(`sha256`, secret)
                     .update(sign)
                     .digest(`base64`).toString()

    let encoded = encodeURIComponent(hash)
    // console.log("encodedkey----> ",encoded);
    return encoded;
}

const price = async (req,res)=>{
    try{
        // console.log("-----------------coming------------------");
        var js={ "sourcePin": req.body.sourcePin,
            "destinationPin": req.body.destinationPin,
            "orderType": req.body.orderType,
            // "modeType": 1,    // Optional, if you are using the auth v3
            "length": parseFloat(req.body.length),
            "width": parseFloat(req.body.width),
            "height": parseFloat(req.body.height),
            "weight": parseFloat(req.body.weight),
            "invoiceValue": parseFloat(req.body.invoiceValue)
        };
        console.log(js);    
        var encoded= generateAuth();
        console.log('endcoded-----------------------> ',encoded);
        const promise1 =  request({
            uri:"https://api.shyplite.com/pricecalculator",
            method:"POST",
            body: js,
            headers: {
                "x-appid": appID,
                "x-sellerid": sellerID,
                "x-timestamp": timestamp,
                "x-version":'3', 
                "Authorization":encoded,
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(js).length
            },
            json: true
        });
        const promise2 =  request({
            uri:`https://api.shyplite.com/getserviceability/${req.body.sourcePin}/${req.body.destinationPin}`,
            method:"GET",
            headers: {
                "x-appid": appID,
                "x-sellerid": sellerID,
                "x-timestamp": timestamp,
                "x-version":'3', 
                "Authorization":encoded,
            },
        });
       const [ response, response2 ] = await Promise.all([promise1,promise2]);
        let post = {
            sourcePin: js.sourcePin,
            destinationPin: js.destinationPin,
            orderType: js.orderType,
            length: js.length,
            width: js.width,
            height: js.height,
            weight: js.weight,
            invoiceValue: js.invoiceValue,
            air:response.body.pricing["air"],
            surface10:response.body.pricing["surface-10kg"],
            surface5:response.body.pricing["surface-5kg"],
            surface30:response.body.pricing["surface-30kg"],
            lite2:response.body.pricing["lite-2kg"],
            lite1:response.body.pricing["lite-1kg"],
            lite05:response.body.pricing["lite-0.5kg"]
        };
        let sql = "INSERT INTO pricecaculator SET ?";
        db.query(sql,post,err=>{
            if(err){
                throw err;
            }
        });
        res.send(response.body);
        // res.send(response2.body);
        console.log("response------",response.body,"\nresponse 2\n",response2.body);
    }
    catch(err){
 
        console.log("ERROOOORRRR____________________",err);
    }
}

var redirectLogin = (req,res,next)=>{
    if(!(req.session.user && req.cookies.user_id)){
        res.redirect('/login');
    }
    else{
        next();
    }
}
var redirecthome = (req,res,next)=>{
    if(req.session.user && req.cookies.user_id){
        res.redirect('/');
    }
    else{
        next();
    }
}

const login =(req,res)=>{
    return res.render("login");
 }
const logincheck=(req,res)=>{
    var un=req.body.ID;
    var p = req.body.Password;

    try{
        if(un=='xxx'&&p=='xxx'){
            req.session.user=un;
            return res.redirect('/');
        }
        res.redirect('/login')
    }
    catch(err){
        console.log(err);
    }
}
const logout =(req,res)=>{
    req.session.destroy(err=>{
        // console.log(err);
        if(err!=undefined)
        return res.redirect('/');
    })
    res.clearCookie('sid');
    return res.redirect('/');
}
module.exports={
    form,price,redirectLogin,redirecthome,login,logincheck,logout
}