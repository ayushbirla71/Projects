const express= require('express');
const mongoose= require('mongoose');
const route= require('./routes/route')
const multer= require('multer')
const app=express();

app.use(express.json());
app.use(multer().any());
mongoose.connect("mongodb+srv://ayush8120:GeGo5qhr7wM6VQyg@cluster0.n1nevi5.mongodb.net/Project02DataBase",{useNewUrlParser:true})
.then(function(){
    console.log("Project 02 Data Base is Connected")
})

.catch(function(errors){
      console.log({errors:errors.message})
})

app.use('/', route);

app.listen(process.env.PORT || 3001, function(){
    console.log("Express app project 02 running on PORT " + 3001 || process.env.PORT )
})
