const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route=require('./router')


app.use(express.json())
mongoose.connect("mongodb+srv://ayush8120:GeGo5qhr7wM6VQyg@cluster0.n1nevi5.mongodb.net/DemoCoins?retryWrites=true&w=majority")
    .then(() => console.log("mongodb is connected"))
    .catch((err) => console.log(err))

    app.use('/', route);

app.listen(3000, function () { console.log("app runnig on port 3000") })