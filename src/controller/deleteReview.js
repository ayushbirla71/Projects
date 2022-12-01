const bookModel = require("../models/bookModel")
const reviewModel=require("../models/reviewModel")
const {isValidObjectId}=require('mongoose')
const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: "Pls provide a valid bookId" }) }
        let bookData = await bookModel.findById(bookId)
        if (!bookData) { return res.status(404).send({ status: false, msg: "No book exists with this Id" }) }
        if (bookData.isDeleted == true) { return res.status(400).send({ status: false, msg: "book not exist already deleted with this Id" }) }
        
        if(!isValidObjectId(reviewId)){return res.status(400).send({status:false, msg: "pls provide valid review Id"})}

        let reviewData= await reviewModel.findById(reviewId)
         
        if(!reviewData) { return res.status(404).send({status:false, msg: "No review exists with this Id"})}

        if(reviewData.isDeleted==true) {return res.status(400).send({status:false, msg:"review not exist already deleted "})}

        if(reviewData.bookId!=bookId){
            return res.status(401).send({status:false,message:"Book Id does not match with the review"})
        }

    
        else {
            let delReview=await reviewModel.findByIdAndUpdate(reviewId,{isDeleted:true},{new:true})
            const bookDoc=await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}},{new:true})
            res.status(200).send({status:true,message:"Success",data:bookDoc})
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports={deleteBook}