const { createCustomer,getCustomer, deleteCustomer} = require("../controllers/customerController")
const {createCard, getCard } = require("../controllers/cardController")

exports.Customer = async function(req,res){
    try {
        let {create,get,Delete}=req.body
        if(create == "yes"){
            createCustomer(req,res)
        }
        else if(get=="yes"){
            getCustomer(req,res)
        }
        else if(Delete=="yes"){
            deleteCustomer(req,res)
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

exports.card = async function(req,res){
    try {
        let {create,get}=req.body
        if(create=="yes"){
            createCard(req,res)
        }else if(get=="yes"){
            getCard(req,res)
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}