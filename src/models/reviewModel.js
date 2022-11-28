const mongoose=require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId
const reviewSchema=mongoose.Schema({
    bookId: {
        type:ObjectId,
        ref:"Book",
        required:true
    },
  reviewedBy: {
    type:String,
    required:true,
    default:"Guest"
  },
  rating: {
    type:Number, 
    min:1, 
    max:5, 
    required:true
},
  isDeleted: {
    type: Boolean, 
    default: false
},
 reviewedAt: {type:Date, required:true},
 review: String
})


module.exports=mongoose.model("Review",reviewSchema)