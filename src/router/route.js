const express= require('express');
const router= express.Router();
const bookController=require('../controller/booksControler');
const userController=require('../controller/userControler');
const middelware=require('../midelware/auth')

router.post('/register', userController.userCreate)
router.post('/login',userController.userLogin)
router.get('/user',middelware.Authentication)
router.post('/books',middelware.Authentication ,bookController.bookCreate)
router.get('/books',middelware.Authentication,bookController.getAllBooks)

router.all('/*',function(req,res){
    return res.status(400).send({status:false, message:"pls provide valid path"})
})


module.exports=router