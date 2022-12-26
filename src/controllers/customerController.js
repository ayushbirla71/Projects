const customerModel = require('../models/customerModel')
const cardModel = require('../models/cardModel')
const { v4: uuidv4 } = require('uuid')
const mobileValidation = /^([+]\d{2})?\d{10}$/
const nameregex = /^[a-zA-Z_ ]{1,30}$/
const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const validDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/

exports.createCustomer = async (req, res) => {
    try {
        let customerDetails = req.body
        let { firstName, lastName, mobileNumber, DOB, emailID, address, status } = customerDetails
        if (!firstName || !lastName || !mobileNumber || !DOB || !emailID || !address) { return res.status(400).send({ status: false, message: "Pls provide firstName,lastName,mobile,DOB,Email,Address" }) }
        if (!firstName.test(nameregex) || !lastName.test(nameregex)) return res.status(400).send({ status: false, message: "pls provide valid name" })
        if(!mobileNumber.test(mobileValidation)) return res.status(400).send({status:false,message:"pls provide valid mobile no"})
        if(!DOB.test(validDate)) return res.status(400).send({status:false,message:"Pls provide valid DOB in (YYYY-MM-DD) format "})
        if(!emailID.test(emailValidation)) return res.status(400).send({status:false,message:"Pls provide valid email id"})
        customerDetails.customerID = uuidv4()
        let customerData = await customerModel.create(customerDetails)
        return res.status(201).send({ status: true, data: customerData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.getCustomer = async (req, res) => {
    try {
        let getData = await customerModel.find({ status: "ACTIVE" })
        if(!getData) return res.status(404).send({status:false,message:"customer data not found"})
        return res.status(200).send({ status: true, data: getData })

    } catch (error) {
        return response.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteCustomer = async (req, res) => {
    try {
        let { customerID } = req.body
        if(!customerID) return res.status(400).send({status:false,message:"pls provide custome id"})
        await customerModel.deleteOne({ customerID })
        return res.status(200).send({ status: true })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

