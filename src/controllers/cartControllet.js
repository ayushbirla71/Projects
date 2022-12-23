const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { isValidObjectId } = require('../validators/validations')

const createCart = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Pls provide valid userId" })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "user not found" })
        let { cartId, productId } = req.body
        if (!productId || !isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Pls provide valid productId" })
        let cartData = await cartModel.findOne({ userId: userId })
        if (cartData) {
            if (!cartId) return res.status(400).send({ status: false, message: "user cart exist pls provide cart id" })
            if (cartId) {
                if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Pls provide valid cartId" })
                if (cartData._id != cartId) return res.status(400).send({ status: false, message: "this cart id is ont mach" })
            }
        }
        let productData = await productModel.findById(productId)
        if (!productData) return res.status(404).send({ status: false, message: "Product not found" })
        let { price } = productData
        let Obj = {}
        let CreateCart
        if (!cartId) {
            Obj = { userId, totalPrice: price, totalItems: 1 }
            Obj.items = { productId, quantity: 1 }
            CreateCart = await cartModel.create(Obj)
        }
        else {
            let cartData = await cartModel.findById(cartId).select({ items: 1, totalItems: 1, totalPrice: 1 })
            let xyz = cartData.items
            let ab = true
            for (let i = 0; i < xyz.length; i++) {
                let ele = xyz[i]
                if (ele.productId == productId) {
                    let a = { productId, quantity: ele.quantity + 1 }
                    cartData.items[i] = a
                    cartData.totalItems = cartData.totalItems + 1
                    cartData.totalPrice = cartData.totalPrice + price
                    Obj = cartData
                    ab = false
                }
            }
            if (ab == true) {
                Obj = { $push: { items: { productId, quantity: 1 } }, $set: { totalPrice: price + cartData.totalPrice, totalItems: cartData.totalItems + 1 } }
            }
            CreateCart = await cartModel.findByIdAndUpdate(cartId, Obj, { new: true })
        }
        return res.status(201).send({ status: true, message: 'Success', data: CreateCart })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}
module.exports = { createCart }