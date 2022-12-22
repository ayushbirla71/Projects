const cartModel=require('../models/cartModel')

const createCart=async (req,res)=>{
    try{
        let userId=req.params.userId
        let cartdata=req.body
        let(productId,cartId)=cartdata
        let Obj={}
        Obj.productId=productId
        Obj.cartId=cartId

        let cartProduct=await cartModel.findByIdAndUpdate(cartId,Obj)
        

    }
    catch(erro){

    }
}