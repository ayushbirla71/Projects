
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    excerpt: {
        type: String,
        require: true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: 'user'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type : String,
        required:true
    },
    subcategory:{
        type:String,
        required:true
    },
    reviews: {
        type:Number, 
        default: 0,
        comment: Number   
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
    },
    releasedAt:{
        type:Date,
        require:true
    }

},{timestamps:true})

module.exports=mongoose.model('Book',bookSchema)