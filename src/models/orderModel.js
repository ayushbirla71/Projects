const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderModel=new mongoose.Schema({
    userId: { type: ObjectId, required: true, unique: true, ref: "User" },
    items: [{
        _id:{id:false},
        productId: {
            type : ObjectId,
            ref: "Product",
            required: true
        },
        quantity: { type: Number, required: true, default:1 }
    }],
    totalPrice:{type:Number,required:true,},
    totalItems:{type:Number,required:true},
    cancellable:{type:Boolean,default:true},
    status:{type:String,default:'pending',enum:['pending','completed','cancled']},
    deletedAt:{type:Date,default:null},
    isDeleted:{type:Boolean,default:false}

},{timestamps:true})

module.exports=mongoose.model('Order',orderModel)