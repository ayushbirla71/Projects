const blogsModel = require('../Models/blogsModel')
const authormodel = require('../Models/author')
const { isValidObjectId } = require("mongoose")
const moment = require('moment')

///////////////////////////////////////~CreateBlogs~////////////////////////////
const CreateBlogs = async function (req, res) {
    try {
        let bodydata = req.body
        let { title, body, authorId, category, isPublished } = req.body
        if (!title) return res.status(400).send({ status: false, Msg: 'title is mandatory' });
        if (!body) return res.status(400).send({ status: false, Msg: 'body is mandatory' });
        if (!authorId) return res.status(400).send({ status: false, Msg: 'authorId is mandatory' });
        if (!category) return res.status(400).send({ status: false, Msg: 'category is mandatory' });
        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, Msg: 'invalid authorId' })
        }
        let author = await authormodel.findById(authorId)
        if (!author) {
            return res.status(404).send({ status: false, msg: 'author dose not exist' })
        } else {
            if (isPublished == true) {
                bodydata.publishedAt = moment().format()
                let authordata = await blogsModel.create(bodydata)
                res.status(201).send({ status: true, data: authordata })
            }
            else {
                let authordata = await blogsModel.create(bodydata)
                res.status(201).send({ status: true, data: authordata })
            }
        }
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

////////////////////////////////////////////~GetBlogs~/////////////////////////
const getBlogs = async function (req, res) {
    try {
        let body = req.query
        body.isDeleted = false
        body.isPublished = body.isPublished || true
        let data = await blogsModel.find(body)
        if (data.length <= 0) {
            return res.status(404).send({ status: false, msg: 'documents are not found' })
        }
        else {
            res.status(200).send({ status: true, data: data })
        }
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

//////////////////////////////////~UpdateBlogs~/////////////////////////////////
const updateBlogs = async function (req, res) {
    try {
        let authorId = req.authorId
        //console.log(authorId)
        let blogId = req.params.blogId
        if (!blogId) { return res.status(400).send({ status: false, msg: "Pls provide BlogId" }) }
        let data=req.body
        if(Object.keys(data).length==0){return res.status(400).send({status:false, msg:"Pls provide data in body"})}
        let { title, body, tags, subcategory, isPublished } = data
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "pls provide a valid BlogId" }) }
        let blogdata = await blogsModel.findById(blogId)
        if (!blogdata) { return res.status(404).send({ status: false, msg: "Blog does not exists" }) }
        if (blogdata.authorId != authorId) { return res.status(401).send({ status: false, msg: "not allow to chenge other author blogs" }) }
        if (blogdata.isDeleted == true) { return res.status(404).send({ status: false, msg: "Page not found , already deleted" }) }
        else {
            let setData = {}
            if (isPublished == false) { setData = { title, body, isPublished, publishedAt: null } }
            else { setData = { title, body, isPublished: true, publishedAt: moment().format() } }
            let updatedata = await blogsModel.findByIdAndUpdate(
                blogId, { $set: setData, $push: { tags, subcategory } },{ new: true })
            return res.status(200).send({ status: true, message: "updated successfully", data: updatedata })
        }
    } catch (error) {
        return res.status(500).send({ status: false, data: error.message })
    }
}
////////////////////////////////////~DeleteBlogs~////////////////////////////////////
const deleteBlog = async function (req, res) {
    try {
        let authorid = req.authorId
        let blogId = req.params.blogId
        if (!blogId) { return res.status(400).send({ status: false, Msg: "Pls provide Blog Id" }) }
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "Pls provide a valid blogId" }) }
        let blogdata = await blogsModel.findById(blogId)
        if (!blogdata) { return res.status(404).send({ status: false, msg: "No blog exists with this Id" }) }
        if (authorid != blogdata.authorId) { return res.status(401).send({ status: false, msg: "Not allow to delete other author bloges" }) }
        if (blogdata.isDeleted == true) { return res.status(400).send({ status: false, msg: "blog not found" }) }
        else {
            let deletedblog = await blogsModel.findByIdAndUpdate(
                blogId, { $set: { isDeleted: true }, deleteAt: moment().format() }
            )
            return res.status(200).send({ status: true })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
///////////////////////////////////~DeleteBlogs~//////////////////////////////
const deleteBlogs = async function (req, res) {
    try {
        let data = req.query
        if (!data) { return res.status(400).send({ status: false, msg: "Pls provide some query" }) }
        data.isDeleted = false
        data.isPublished = false
        let Decodedauthorid = req.authorId
        let authorId = data.authorId
        if (authorId) { if (!isValidObjectId(authorId)) { return res.status(400).send({ status: false, msg: "Pls provide a valid autorId" }) } }
        if (authorId) { if (authorId != Decodedauthorid) { return res.status(403).send({ status: false, Msg: "You are not Authorized to delete it" }) } }
        data.authorId = Decodedauthorid
        let check = await blogsModel.find(data)
        if (check.length <= 0) { return res.status(404).send({ status: false, msg: "Blog not found" }) }
        let deleteblogs = await blogsModel.updateMany(data, { $set: { isDeleted: true }, deleteAt: moment().format() }
        )
        return res.status(200).send({ status: true })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
//////////////////////////////////~Modules~///////////////////////////////
module.exports.CreateBlogs = CreateBlogs
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogs = deleteBlogs
