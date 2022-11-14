const blogsModel=require('../Models/blogsModel')
const authormodel=require('../Models/author')
//const {IsValidObjectId}= require('mongoose')
const mongoose = require("mongoose")
let isValidObjectId = function (value){
    if(!mongoose.Types.ObjectId.isValid(value)){
      return false
    }
    else{
      return true
    }
  }


const CreateBlogs=async function(req, res){
    try{
        let bodydata = req.body
        let {title,body,authorId,category,}=req.body
        if(!title||!body||!authorId||!category){
            return res.status(400).send('provide data')
        }
        if(!isValidObjectId(authorId)){
            return res.status(400).send('invalid authorId')
        }
        let author= await authormodel.findById(authorId)
        if(!author){
            return res.status(404).send('author dose not exist')
        }
        let authordata=await blogsModel.create(bodydata)
        res.status(201).send(authordata)
    }
    catch(error){
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}



 module.exports.CreateBlogs=CreateBlogs