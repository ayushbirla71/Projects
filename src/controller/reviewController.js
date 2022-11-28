const reviewModel=require('../models/reviewModel')
const bookModel=require('../models/bookModel')

const createReview=async (req,res)=>{
    console.log(req.params.bookId)
    const data=req.body
    data.bookId=req.params.bookId
    data.reviewedAt=new Date()
    const createdReview=await reviewModel.create(data)
    bookModel.findByIdAndUpdate(req.params.bookId,{$inc:{reviews:1}})
    res.status(201).send({status:true,message:"Review created",data:createdReview})
}

module.exports.createReview=createReview