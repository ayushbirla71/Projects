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
        ProductData.price = price

        let finalProduct=await productModel.create(ProductData)
        return res.status(201).send({status:false,data:finalProduct})
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getProductByQuery = async function(req,res){
    try {
        let filters = req.query
        let {size,name,priceGreaterThan,priceLessThan}=filters
        let obj={}
        if(size){
            if(!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size)){
                return res.status(400).send({status:false,message:"Size must be from this - [ S , XS , M , X , L , XXL , XL ]"})
            }
           obj.availableSizes=size 
        }
        if(name){
            obj.title=name
        }
        if(priceGreaterThan || priceLessThan){
            if(priceGreaterThan&&priceLessThan){
                obj.price = {$lt : priceLessThan , $gt : priceGreaterThan}
            }else if(priceGreaterThan){
                obj.price = {$gt : priceGreaterThan}
            }else if(priceLessThan){
                obj.price = {$lt : priceLessThan}
            }
        }
        let getProductByQuery = await productModel.find(obj)
        if(getProductByQuery.length==0)return res.status(404).send({status:false,message:"No product exists with given filter"})
        return res.status(200).send({status:true,message:"Success",data:getProductByQuery})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports={createProduct,getProductByQuery}