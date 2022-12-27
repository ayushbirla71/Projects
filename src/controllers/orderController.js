const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const { isValidObjectId } = require('mongoose')
const userModel = require("../models/userModel")

const createOrder = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Pls provide a valid UserId" })
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, message: "No User exists with this UserId" })

        let data = req.body
        let { cartId, cancellable } = data
        if (!cartId) return res.status(400).send({ status: false, message: "Pls provide CartId" })
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Pls provide a Valid cartId" })
        let cartData = await cartModel.findById(cartId).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()
        if (!cartData) return res.status(404).send({ status: false, message: "No Cart found with this CartId" })
        let totalQuantity = 0
        cartData.items.map((ele) => { totalQuantity += ele.quantity })

        cartData.totalQuantity = totalQuantity
        if (cancellable) {
            if (!['true', 'false'].includes(cancellable)) return res.status(400).send({ status: false, message: "Pls provide cancellable only from - ( true , false )" })
            cartData.cancellable = cancellable
        }

        let userOrder = await orderModel.findOne({ cartId: cartId, status: "pending" })
        if (userOrder) return res.status(201).send({ status: true,message:"Success" ,data: userOrder })

        let Order = await orderModel.create(cartData)
        return res.status(201).send({ status: true, message: "Success", data: Order })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id " })
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, message: "User not found" })
        let cartData= await cartModel.findOne({userId:userId})
        if(!cartData)return res.status(404).send({status:false,message:"user Cart not found"})

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide Order data" })

        let { orderId, status } = data
        if (!orderId) return res.status(400).send({ status: false, message: "Please provide Order Id " })
        if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: "Please provide valid Order Id " })
        const orderDetail = await orderModel.findOne({ _id: orderId,userId:userId, isDeleted: false })///add userId
        if (!orderDetail) return res.status(404).send({ status: false, message: "No Order found" })

        if (!status) return res.status(400).send({ status: false, message: "Please provide status " })
        if (!["completed", "cancelled"].includes(status)) return res.status(400).send({ status: false, message: "status should be from [completed, cancelled]" })
      //  if (orderDetail.status != "pending") return res.status(400).send({ status: false, message: "Order can be update only once" })

        if(orderDetail.status=="completed") return res.status(400).send({status:true,message:"your order is alredy completed"})
        if(orderDetail.status=="cancelled") return res.status(400).send({status:true,message:"your order is alredy cancelled"})


        if(orderDetail.cancellable==false&&status=="cancelled")return res.status(400).send({status:false,message:"your order cant be cancelled"})

        let updateOrder = await orderModel.findOneAndUpdate({ _id: orderId,userId:userId },
            { $set: { status } }, { new: true })
        // if (!updateOrder) return res.status(400).send({ status: false, message: " This order is not cancellable" })

        await cartModel.findOneAndUpdate({ userId },
            { $set: { items: [], totalItems: 0, totalPrice: 0 } })


        return res.status(200).send({ status: true, message: "Success", data: updateOrder })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createOrder, updateOrder }