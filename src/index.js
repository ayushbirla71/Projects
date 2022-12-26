const express = require('express')
const mongoose = require('mongoose')
const route = require('./router/route')
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://ayush8120:GeGo5qhr7wM6VQyg@cluster0.n1nevi5.mongodb.net/Backend_Engineer?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>{console.log("MongoDB is Connected")})
.catch((err)=>{console.log(err.message)})

app.use('/',route)

app.listen(process.env.PORT ||3000,function ()
{console.log("Express app is running on port "+(process.env.PORT ||3000))})