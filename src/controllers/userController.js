const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const { isValidName, isValidEmail, isValidObjectId, isValidString, isValidPhone, isValidPassword, isValidPincode } = require('../validators/validations')
const { getImage } = require("./aws")

const createUser = async function (req, res) {
    try {
        let data = req.body
        let { fname, lname, email, profileImage, phone, password, address } = data
        let files = req.files
        address=JSON.parse(address)
    
        if(!files)
        {
            return res.status(400).send({ status: false, message: "Please provide Profile Image" })
        }
        data.profileImage = await getImage(files)

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide data" })
        }
        if (!fname) {
            return res.status(400).send({ status: false, message: "Please provide First Name" })
        }
        if (!isValidName(fname)) {
            return res.status(400).send({ status: false, message: "Please provide valid First Name" })
        }
        if (!lname) {
            return res.status(400).send({ status: false, message: "Please provide Last name" })
        }
        if (!isValidName(lname)) {
            return res.status(400).send({ status: false, message: "Please provide valid Last name" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "Please provide Email" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid Email Id" })
        }
        
        if (!phone) {
            return res.status(400).send({ status: false, message: "Please provide Phone" })
        }
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Please provide Phone" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Please provide Password" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Please provide Password" })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt)
        data.password = secPass

        if (Object.keys(address).length==0) {
            return res.status(400).send({ status: false, message: "Please provide Address" })
        }
        let {shipping,billing} = address
        
        if (!shipping) {
            return res.status(400).send({ status: false, message: "Please provide Shipping Address" })
        }
        if (shipping) {
            let { street, city, pincode } = shipping
            if (!street) {
                return res.status(400).send({ status: false, message: "Please provide Street" })
            }
            if (!city) {
                return res.status(400).send({ status: false, message: "Please provide City" })
            }
            if (!pincode) {
                return res.status(400).send({ status: false, message: "Please provide Pincode" })
            }
        }
        if (!billing) {
            return res.status(400).send({ status: false, message: "Please provide Billing Address" })
        }
        if (billing) {
            let { street, city, pincode } = billing
            if (!street) {
                return res.status(400).send({ status: false, message: "Please provide Street" })
            }
            if (!city) {
                return res.status(400).send({ status: false, message: "Please provide City" })
            }
            if (!pincode) {
                return res.status(400).send({ status: false, message: "Please provide Pincode" })
            }
        }

        let saveDetails = await userModel.create(data)


        return res.status(201).send({ status: true, message: "User Created Successfully", data: saveDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser }