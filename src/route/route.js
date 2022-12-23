const express = require('express')
const router = express.Router()
const link = require('../controllers/aws')
const { createUser,userLogin,UpdateUser, getUserProfile } = require('../controllers/userController')
const {createProduct, getProductByQuery, getProductById, deleteProductById, updateProduct}=require('../controllers/productController')
const {createCart, updateCart}=require('../controllers/cartControllet')


router.get("/test-me",function(req,res){
    res.send("This is the test Api!!!!!!!!!!!!!!")
})

//-------------------- user ------------------//
router.post('/register', createUser)
router.post('/login',userLogin)
router.put('/user/:userId/profile',UpdateUser)
router.get('/user/:userId/profile', getUserProfile)

//------------------- Product ----------------//
router.post('/products',createProduct)
router.get('/products',getProductByQuery)
router.get('/products/:productId',getProductById)
router.put('/products/:productId',updateProduct)
router.delete('/products/:productId',deleteProductById)

//-------------------- Cart ------------------//
router.post('/users/:userId/cart',createCart)
router.put('/users/:userId/cart',updateCart)


module.exports = router