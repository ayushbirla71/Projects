const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')
const app = express()

app.use(express.json())

// mongoose.connect("",{useNewUrlParser:true})
// .then(()=>console.log("MongoDB is connected"))
// .catch((err)=>console.log(err))

app.use('/',route)

app.listen(process.env.PORT ||3000,console.log("Express app is running on port "+(process.env.PORT ||3000)))