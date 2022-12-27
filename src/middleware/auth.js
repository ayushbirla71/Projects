const jwt = require("jsonwebtoken")
const secreteKey = "project05"
const { isValidObjectId } = require('mongoose')

const authenticationMid = async function (req, res, next) {
    try {
        let bearerToken = req.headers["authorization"]
        // console.log(req.headers)
        if (typeof bearerToken == "undefined") {
            return res.status(400).send({ status: false, message: "bearer token is missing" })
        }
        bearerToken = bearerToken.split(" ")[1]
        jwt.verify(bearerToken, secreteKey,
            function (err, result) {
                if (err) return res.status(401).send({ status: false, message: err })
                else {
                    req.userId = result.userId
                    next()
                }
            }
        )
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorizationMid = async function (req, res, next) {
    try {
        let userId = req.params.userId
        // UserId Validation :-
        if (!userId) {
            return res.status(400).send({ status: false, message: "Please provide userId" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId not valid" })
        }
        //-----------------------Authorization-----------------//
        if (userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorization error" })
        //----------------------------------------------------//
        next()

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    authenticationMid,
    authorizationMid
}