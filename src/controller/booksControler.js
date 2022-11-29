const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const validate = /^(\d{4}-\d{2}-\d{2})$/gm

const { isValidObjectId } = require("mongoose")

const bookCreate = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "pls provide book ditails in body" })
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (!title) return res.status(400).send({ status: false, message: "Pls provide title" })
        if (typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid title" })
        };
        let dublicatTitle = await bookModel.findOne({ title })
        if (dublicatTitle) return res.status(400).send({ status: false, message: "pls provide unique title" })
        if (!excerpt) return res.status(400).send({ status: false, message: "Pls provide excerpt" })
        if (typeof excerpt !== "string" || excerpt.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid excerpt" })
        };
        if (!userId) return res.status(400).send({ status: false, message: "Pls provide userId" })
        if (typeof userId !== "string" || userId.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid userId" })
        };
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Pls provide valid UserId" })
        if (!ISBN) return res.status(400).send({ status: false, message: "Pls provide ISBN" })
        if (typeof ISBN !== "string" || ISBN.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid ISBN" })
        };
        let dublicatISBN = await bookModel.findOne({ ISBN })
        if (dublicatISBN) return res.status(400).send({ status: false, message: "pls provide unique ISBN" })
        if (!category) return res.status(400).send({ status: false, message: "Pls provide category" })
        if (typeof category !== "string" || category.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid category" })
        };
        if (!subcategory) return res.status(400).send({ status: false, message: "Pls provide subcategory" })
        if (typeof subcategory !== "string" || subcategory.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid subcategory" })
        };
        if (!releasedAt) return res.status(400).send({ status: false, message: "Pls provide released date  (YYYY-MM-DD)" })
        if (typeof releasedAt !== "string" || releasedAt.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid releasedAt" })
        };
        if (!validate.match(releasedAt)) return res.status(400).send({ status: false, message: "Pls enter valid date (YYYY-MM-DD)format" })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "User not found" })
        if (req.decodedUserId != userId) return res.status(401).send({ status: false, message: "Your not authorised to create book" })
        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: createBook })
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

const getAllBooks = async function (req, res) {
    try {
        let data = req.query
        if (data.userId) {
            if (!isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: "Pls enter valid userId" })
        }
        let allBooks = await bookModel.find(data, { isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (allBooks.length == 0) return res.status(404).send({ status: false, message: "Books not found" })
        else {
            return res.status(200).send({ status: true, message: "Books list", data: allBooks })
        }
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

const getbooksBybookId = async function (req, res) {
    try {
        let data = req.params.bookId
        if (!data) return res.status(400).send({ status: false, message: "Pls provide bookId" })
        if (!isValidObjectId(data)) return res.status(400).send({ statu: false, message: "pls provide valid BookId" })
        let bookDetails = await bookModel.findById(data)
        if (!bookDetails) return res.status(404).send({ status: false, message: "book not found" })
        let reviewDetails = await reviewModel.find({ bookId: bookDetails.id })
        bookDetails._doc.reviewsData = reviewDetails
        return res.status(200).send({ status: true, message: "Book List", data: bookDetails })

    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

const bookUpdated = async function (req, res) {
    try {
        let data = req.params.bookId
        if (!isValidObjectId(data)) return res.status(400).send({ status: false, message: "Pls provide valid BookId" })
        let data1 = req.body
        if (Object.keys(data1).length == 0) return res.status(400).send({ status: false, message: "Pls provide data" })
        let { userId, isDeleted } = await bookModel.findById(data).select({ userId: 1, _id: 0, isDeleted: 1 })
        if (!userId || isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" })
        if (userId != req.decodedUserId) return res.status(403).send({ status: false, message: "You are not authorised for update this doc" })
        let { title, excerpt, releasedAt, ISBN } = req.body
        let keys = {}
        if (title) {
            if (typeof title !== "string" || title.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid title" })
            };
            keys.title = title
            let dublicatTitle = await bookModel.findOne({ title });
            if (dublicatTitle) return res.status(400).send({ status: false, message: "this title is allredy present" })
        }
        if (excerpt) {
            if (typeof excerpt !== "string" || excerpt.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid excerpt" })
            };
            keys.excerpt = excerpt
            let dublicatExcert = await bookModel.findOne({ excerpt });
            if (dublicatExcert) return res.status(400).send({ status: false, message: "this excert is allredy present" })
        }
        if (releasedAt) {
            if (typeof releasedAt !== "string" || releasedAt.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid releasedAt" })
            };
            if (!validate.match(releasedAt)) return res.status(400).send({ status: false, message: "Pls enter valid date (YYYY-MM-DD)format" })
            keys.releasedAt = releasedAt
            let dublicatReleasedAt = await bookModel.findOne({ releasedAt });
            if (dublicatReleasedAt) return res.status(400).send({ status: false, message: "this relesedAt is allredy present" })
        }
        if (ISBN) {
            if (typeof ISBN !== "string" || ISBN.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid ISBN" })
            };
            keys.ISBN = ISBN
            let dublicatISBN = await bookModel.findOne({ ISBN });
            if (dublicatISBN) return res.status(400).send({ status: false, message: "this ISBN is allredy present" })
        }
        let updatedata = await bookModel.findByIdAndUpdate(data, { $set: keys, updatedAt: Date.now() }, { new: true })
        return res.status(200).send({ status: true, data: updatedata })

    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

const bookDelete = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "pls enter valid BookId" })
        let bookDetails = await bookModel.findById(bookId)
        if (!bookDetails) return res.status(404).send({ status: false, message: "book dose not exist" })
        if (bookDetails.isDeleted == true) return res.status(404).send({ status: false, message: "book not found" })
        if (bookDetails.userId != req.decodedUserId) return res.status(403).send({ status: false, message: "You are not authorised for delete this doc " })
        let bookDeleted = await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        return res.status(200).send({ status: true, message: "Book deleted successful" })

    }
    catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}

module.exports = { bookCreate, getAllBooks, getbooksBybookId, bookUpdated, bookDelete }