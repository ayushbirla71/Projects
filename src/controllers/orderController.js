const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")

const createOrder = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let cartId = data.cartId
        let cartData = await cartModel.findById(cartId).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        console.log(cartData)
        let Obj = { userId: userId, items: cartData.items, totalPrice: cartData.totalPrice, totalItems: cartData.totalItems }
        let Order = await orderModel.create(Obj)
        return res.status(201).send({ status: true, message: "success", data: Order })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createOrder }