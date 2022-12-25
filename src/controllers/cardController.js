const customerModel = require('../models/customerModel')
const cardModel = require('../models/cardModel')
const { v4: uuidv4 } = require('uuid')

exports.getCard = async function(req,res){
    try {
        let getCard = await cardModel.find()
        return res.status(200).send({status:true,data:getCard})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.createCard = async function(req,res){
    try {
        let data = req.body
        let getCard = await cardModel.find().count()
        let {cardNumber,cardType,customerName,status,vision,customerId} = data
        cardNumber = "C"+("00"+(getCard+1)).slice(-3)
        data.cardNumber = cardNumber
        let createCard = await cardModel.create(data)
        return res.status(201).send({status:true,data:createCard})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
