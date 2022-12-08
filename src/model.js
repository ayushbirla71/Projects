const mongoose=require('mongoose')

let data1=new mongoose.Schema( { 
    symbol:String,
    name:String,
    marketCapUsd:String,
   priceUsd:String,
   vwap24Hr:String,
   
})

module.exports=mongoose.model('asits',data1)
