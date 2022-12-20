const express = require('express')
const router = express.Router()
const link = require('../controllers/aws')
const { createUser,userLogin,UpdateUser } = require('../controllers/userController')
const {createProduct}=require('../controllers/productController')


router.get("/test-me",function(req,res){
    res.send("This is the test Api!!!!!!!!!!!!!!")
})

 router.post('/register', createUser)
router.post('/login',userLogin)
router.put('/user/:userId/profile',UpdateUser)

//---------------------Product-------------//
router.post('/products',createProduct)

//----------------------AWS-------------
router.post('/write-file-aws',link.getImage)


module.exports = router