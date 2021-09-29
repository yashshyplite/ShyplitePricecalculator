const express = require('express');
const router=express.Router();
const {form,price}=require('../controllers/calculator')
const bodyParser = require('body-parser');


var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/',form);
router.post('/post',urlencodedParser,price);

module.exports=router;