const productModel = require('../models/productModel')
const { getImage } = require("./aws")

const createProduct = async (req, res) => {
    try {
        let ProductData = req.body
        let files = req.productImage
        ProductData.profileImage = await getImage(files)
        let {
            title, description, isFreeShipping, price, currenclyId, availableSize, style, installments
        } = ProductData

        ProductData.currencyFormat = '₹'
        ProductData.price = price.num.toFixed(2)

        let finalProduct=await productModel.create(ProductData)
        return res.status(201).send({status:false,data:finalProduct})
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports={createProduct}