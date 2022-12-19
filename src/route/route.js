const express = require('express')
const router = express.Router()

router.get("/test-me",function(req,res){
    res.send("This is the test Api!!!!!!!!!!!!!!")
})

module.exports = router