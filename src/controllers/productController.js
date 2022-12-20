const productModel = require('../models/productModel')
const { getImage } = require("./aws")
const jwt = require('jsonwebtoken')
const { isValidName, isValidEmail, isValidObjectId, isValidString, isValidPhone, isValidPassword, isValidPincode, isValidBody } = require('../validators/validations')

const createProduct = async (req, res) => {
    try {
        let files = req.files
        let ProductData = req.body
        let {
            title, description, isFreeShipping, price, currencyId, availableSizes, style, installments
        } = ProductData
        if (!title || !isValidString(title)) {
            return res.status(400).send({ status: false, message: "Please provide title" })
        }
        let duplicateTitle = await productModel.findOne({title})
        if(duplicateTitle){
            return res.status(400).send({status:false, msg: "Title is already exist"})
        }
        if (!description || !isValidString(description)) {
            return res.status(400).send({ status: false, message: "Please provide description" })
        }
        if (!price) {
            return res.status(400).send({ status: false, message: "Please provide price" })
        }
        if (!currencyId || !isValidString(currencyId)) {
            return res.status(400).send({ status: false, message: "Please provide currencyId" })
        }
        if (currencyId != "INR") {
            return res.status(400).send({ status: false, message: "Please provide INR only" })
        }
        if (availableSizes) {
            availableSizes = availableSizes.trim()
            const arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            const values = availableSizes.split(" ")
            console.log(values)

            const multipleExist = values.every(value => {
                return arr.includes(value);
            });

            if (multipleExist == false) {
                return res.status(400).send({ status: false, message: "pls provide valid size(S, XS, M, X, L, XXL, XL)" })
            }
        }

        ProductData.currencyFormat = '₹'
        price = Number(price)
        ProductData.price = price.toFixed(2)

        console.log(ProductData.price)
        if (!files) {
            return res.status(400).send({ status: false, message: "Please provide Profile Image" })
        }
        ProductData.productImage = await getImage(files)

        let finalProduct=await productModel.create(ProductData)
        return res.status(201).send({status:false,data:finalProduct})
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createProduct }