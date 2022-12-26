const customerModel = require('../models/customerModel')
const cardModel = require('../models/cardModel')
const { v4: uuidv4 } = require('uuid')

exports.getCard = async function(req,res){
    try {
        let getCard = await cardModel.find()
        if(getCard.length==0) return res.status(404).send({status:false,message:"no cart data available"})
        return res.status(200).send({status:true,data:getCard})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.createCard = async function(req,res){
    try {
        let data = req.body
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body cant be empty"})
        let getCard = await cardModel.find().count()
        if(!getCard) return res.status(404).send({status:false,message:"card data not found"})
        let {cardNumber,cardType,customerName,status,vision,customerId} = data
        if(!cardNumber||!cardType||!customerName||!vision||!customerId) return res.status(400).send({status:false,message:"pls provide data"})
        cardNumber = "C"+("00"+(getCard+1)).slice(-3)
        data.cardNumber = cardNumber
        let createCard = await cardModel.create(data)
        return res.status(201).send({status:true,data:createCard})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
