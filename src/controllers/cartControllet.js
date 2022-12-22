const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')

const createCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let { cartId, productId } = req.body
        let { price } = await productModel.findById(productId)
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
            let ab=true
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