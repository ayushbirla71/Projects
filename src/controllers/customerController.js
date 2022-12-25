const customerModel = require('../models/customerModel')
const cardModel = require('../models/cardModel')
const { v4: uuidv4 } = require('uuid')

exports.createCustomer = async (req, res) => {
    try {
        let customerDetails = req.body
        let { firsName, lastName, mobileNumber, DOB, emailID, address, status } = customerDetails
        customerDetails.customerID = uuidv4()
        let customerData = await customerModel.create(customerDetails)
        return res.status(201).send({ status: true, data: customerData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.getCustomer=async (req,res)=>{
    try {
        let getData= await customerModel.find({status:"ACTIVE"})
        return res.status(200).send({status:true,data:getData})
        
    } catch (error) {
        return response.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteCustomer = async (req,res)=>{
    try {
        let {customerID}=req.body
        await customerModel.deleteOne({customerID})
        return res.status(200).send({status:true})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

