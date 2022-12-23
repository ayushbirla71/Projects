const express = require('express')
const router = express.Router()
const link = require('../controllers/aws')
const { createUser,userLogin,UpdateUser, getUserProfile } = require('../controllers/userController')
const {createProduct, getProductByQuery, getProductById, deleteProductById, updateProduct}=require('../controllers/productController')
const {createCart, updateCart, deleteCart, getCart}=require('../controllers/cartControllet')
const { createOrder } = require('../controllers/orderController')
const { authenticationMid } = require('../middleware/auth')


router.get("/test-me",function(req,res){
    res.send("This is the test Api!!!!!!!!!!!!!!")
})

//-------------------- user ------------------//
router.post('/register', createUser)
router.post('/login',userLogin)
router.get('/user/:userId/profile',authenticationMid, getUserProfile)
router.put('/user/:userId/profile',authenticationMid,UpdateUser)

//------------------- Product ----------------//
router.post('/products',createProduct)
router.get('/products',getProductByQuery)
router.get('/products/:productId',getProductById)
router.put('/products/:productId',updateProduct)
router.delete('/products/:productId',deleteProductById)

//-------------------- Cart ------------------//
router.post('/users/:userId/cart',createCart)
router.put('/users/:userId/cart',updateCart)
router.get('/users/:userId/cart',getCart)
router.delete('/users/:userId/cart',deleteCart)

//------------------------Order -----------------//
router.post('/users/:userId/orders',createOrder)


module.exports = router