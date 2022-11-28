const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const { isValidObjectId } = require("mongoose")

const bookCreate = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "pls provide book ditails in body" })
        let { title, excerpt, userId, ISBN, category, subcategory } = data
        if (!title) return res.status(400).send({ status: false, message: "Pls provide title" })
        let dublicatTitle = await bookModel.findOne({ title })
        if (dublicatTitle) return res.status(400).send({ status: false, message: "pls provide unique title" })
        if (!excerpt) return res.status(400).send({ status: false, message: "Pls provide excerpt" })
        if (!userId) return res.status(400).send({ status: false, message: "Pls provide userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Pls provide valid UserId" })
        if (!ISBN) return res.status(400).send({ status: false, message: "Pls provide ISBN" })
        let dublicatISBN = await bookModel.findOne({ ISBN })
        if (dublicatISBN) return res.status(400).send({ status: false, message: "pls provide unique ISBN" })
        if (!category) return res.status(400).send({ status: false, message: "Pls provide category" })
        if (!subcategory) return res.status(400).send({ status: false, message: "Pls provide subcategory" })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "User not found" })
        if(req.decodedUserId!=userId)return res.status(401).send({status:false,message:"Your not authorised to create book"})
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
        let allBooks = await bookModel.find(data,{ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
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

module.exports = { bookCreate, getAllBooks }