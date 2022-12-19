const express = require('express')
const router = express.Router()
const link = require('../controllers/aws')
const { createUser } = require('../controllers/userController')


router.get("/test-me",function(req,res){
    res.send("This is the test Api!!!!!!!!!!!!!!")
})

router.post('/register', createUser)

//----------------------AWS-------------
router.post('/write-file-aws',link.getImage)


module.exports = router