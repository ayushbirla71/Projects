const express = require('express');
const router = express.Router();

//////////////////////////~Import folder~////////////////////////
const author=require('../control/authorcontrol')
const bloges=require('../control/blogscontrol')
const middleware=require('../middleware/auth')

/////////////////////////~Router besed Api~//////////////////////
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
/////////////////////~Author Api~//////////////////////////
router.post('/authors',author.createAuthor)
router.post('/login',author.loginUser)

////////////////////////~Blogs Api~///////////////////////////
router.post('/blogs',middleware.Authentication,bloges.CreateBlogs)

router.get('/blogs',middleware.Authentication,bloges.getBlogs)

router.put('/blogs/:blogId',middleware.Authentication,bloges.updateBlogs)

router.delete('/blogs/:blogId',middleware.Authentication,bloges.deleteBlog)

router.delete('/blogs',middleware.Authentication,bloges.deleteBlogs)

/////////////////////////~exports Modules~/////////////////////////////
module.exports = router;