const {isValidObjectId}=require('mongoose')
const bookModel=require('../models/bookModel')
const userModel=require("../models/userModel")

const reviewValidator=async (req,res,next)=>{
    try{
        
    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:"Request body cannot be empty"})
    }
    
    //reviewedBy validations
if(!req.body.reviewedBy){
    return res.status(400).send({status:false,message:"reviewedBy field is not provided"})
}
else{
    if(typeof req.body.reviewedBy!="string"){
        return res.status(400).send({status:false,message:"reviewedBy should be string"})
    }
   
}
//===============================================================================================

    
//=================================================================================================

//bookId validation
        if(!isValidObjectId(req.params.bookId)){
           return  res.status(400).send({status:false,message:"Please enter a valid book ID in path arams"})
        }
        else{
            let availableBooks=await bookModel.findById(req.params.bookId)
            if(!availableBooks){
               return res.status(400).send({status:false,message:"No book with the given ID"})
            }
        }
    //=============================================================================================

    //validations for ratings

    if(!req.body.rating){
        return res.status(400).send({status:false,message:"Rating should be provided in request body"})
    }
    else{
        const rating=req.body.rating
    if(!(typeof rating=="number"&&(rating>=1&&rating<=5))){
          return  res.status(400).send({status:false,message:"Rating shold be a number between 1 and 5"})
        }
    }
    //==========================================================================================
    req.body.review=req.body.review.trim()
    next()
}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

module.exports.reviewValidator=reviewValidator