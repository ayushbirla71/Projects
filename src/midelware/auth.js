const jwt=require('jsonwebtoken')
////////////////////////~Authentication~/////////////////////////
const Authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in the request header" })
        jwt.verify(token, "xyz", (error, decodedToken) => {
            if (error) { return res.status(401).send({ status: false, msg: error.message }) }

            req.authorId = decodedToken.userId
            next()
        })

    }
    catch (error) {
        res.status(500).send({ msg: error })
    }
}



////////////////////////////////////~Module~/////////////////////////////////////////
module.exports.Authentication = Authentication