const crypto = require("crypto");
const util = require('util');
require('dotenv').config();
const requesting = require('request');
const request = util.promisify(requesting);


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
        const response = await request({
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
        res.send(response.body);
        console.log("response------",response.body);
    }
    catch(err){
 
        console.log("ERROOOORRRR____________________",err);
    }
}

module.exports={
    form,price
}