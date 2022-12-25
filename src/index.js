const express = require('express')
const mongoose = require('mongoose')
const route = require('./router/route')
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://harsh258:Wb5QwC0mG0iUBIXS@new-cluster.baoq1vx.mongodb.net/BackEndTest-DB",{useNewUrlParser:true})
.then(()=>{console.log("MongoDB is Connected")})
.catch((err)=>{console.log(err.message)})

app.use('/',route)

app.listen(process.env.PORT ||3000,function ()
{console.log("Express app is running on port "+(process.env.PORT ||3000))})