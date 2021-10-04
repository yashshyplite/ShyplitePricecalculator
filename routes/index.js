const express = require('express');
const router=express.Router();
const {form,price,redirectLogin,redirecthome,login,logincheck}=require('../controllers/calculator')


router.get('/',redirectLogin,form)
router.post('/post',price);
router.get('/login',redirecthome,login);
router.post('/login',logincheck)

module.exports=router;