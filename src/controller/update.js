const reviewModel=require('../models/reviewModel')
const bookModel=require('../models/bookModel')

const validate = require('../validator/validators')


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PUT---API<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const updateReview = async (req, res) => {

    try {
        const reviewID = req.params.reviewId
        const bookId = req.params.bookId
        let dataToUpdate = req.body
        let updateQuery = {}

        if (!validate.isValidRequestBody(dataToUpdate)) {
            return res.status(400).send({ status: false, message: "Please Provide Data To Update" })
        }
        if (!validate.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid Book Id" })
        }
        let isBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!isBook) {
            return res.status(404).send({ status: false, message: "Book Not Found, PLease check book Id" })
        }
        if (!validate.isValidObjectId(reviewID)) {
            return res.status(400).send({ status: false, message: "Invalid ReviewId" })
        }
        let isReview = await reviewModel.findOne({ _id: reviewID, isDeleted: false })
       if (!isReview) {
           return res.status(404).send({ status: false, message: "Review Not Found, Please Check Review Id" })
       }

        if (isReview['bookId'] != bookId) {
            return res.status(400).send({ status: false, message: "This review dosent belong To given Book Id" })
        }
        let { reviewedBy, rating, review } = dataToUpdate
        let reviewKeys = ["reviewedBy", "rating", "review"]
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            let keyPresent = reviewKeys.includes(Object.keys(req.body)[i])
            if (!keyPresent)
                return res.status(400).send({ status: false, msg: "Wrong Key present" })
        }
        if (Object.keys(dataToUpdate).includes("reviewedBy")) {
            if (typeof reviewedBy != 'string') {
                return res.status(400).send({ status: false, message: "Please Give a proper Name" })
            }
            if ((reviewedBy.trim() == "") || (reviewedBy == null)) {
                reviewedBy = 'Guest'
            }
            updateQuery.reviewedBy = reviewedBy
        }

        if (Object.keys(dataToUpdate).includes("rating")) {
            if (typeof rating != 'number') {
                return res.status(400).send({ status: false, message: "invalid Rating Input" })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Invalid Rating! , please rate in beetween 1 to 5" })
            }
            updateQuery.rating = rating
        }

        if (Object.keys(dataToUpdate).includes("review")) {
            if (!validate.isValid(review)) {
                return res.status(400).send({ status: false, message: "Please Enter A Valid Review" })
            }
            updateQuery.review = review
        }

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewID, isDeleted: false },
            { $set: updateQuery },
            { new: true })

        let finalReview = { ...updatedReview.toObject() }
        delete finalReview.createdAt
        delete finalReview.updatedAt
        delete finalReview.__v
        return res.status(200).send({ status: true, message: "Success", Data: { ...isBook.toObject(), reviewsData: [finalReview] } })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.updateReview =updateReview 



//=====================================================================================================
