const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const mobileValidation = /^([+]\d{2})?\d{10}$/
const nameregex = /^[a-zA-Z_ ]{1,30}$/
const passwordValidation = /^[a-zA-Z0-9]{8,15}$/


const userCreate = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Pls provide user details" })
    let { title, name, phone, email, password } = data
    if (!title) return res.status(400).send({ status: false, message: "title is mandatory" })
    if (title == "Mr" || title == "Mrs" || title == "Miss") {
      if (!name) return res.status(400).send({ status: false, message: "name is mandatory" })
      if (!name.match(nameregex)) return res.status(400).send({ status: false, message: "Pls provide valid name" })
      if (!phone) return res.status(400).send({ status: false, message: "phone no is mandatory" })
      if (!phone.match(mobileValidation)) return res.status(400).send({ status: false, message: "Pls privide valid Phone no" })
      let dublicatPhone = await userModel.findOne({ phone })
      if (dublicatPhone) return res.status(400).send({ status: false, message: "Pls provide unique phone no" })
      if (!email) return res.status(400).send({ status: false, message: "email is mandatory" })
      if (!email.match(emailValidation)) return res.status(400).send({ status: false, message: "Pls provide valid email" })
      let dublicatEmail = await userModel.findOne({ email })
      if (dublicatEmail) return res.status(400).send({ status: false, message: "Pls provide unique Email" })
      if (!password) return res.status(400).send({ status: false, message: "password is mandatory" })
      if (!password.match(passwordValidation)) return res.status(400).send({ status: false, message: "Pls privide Password minLen 8, maxLen 15" })
      let createUser = await userModel.create(data)
      return res.status(201).send({ status: true, message: 'Success', data: createUser })
    }
    else { return res.status(400).send({ status: false, message: "Pls provide valid title Mr, Mrs, Miss " }) }
  }
  catch (error) {
    return res.status(500).send({ status: false, data: error.message })
  }
}


const userLogin = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Pls provide data" })
    let { email, password } = data
    if (!email) return res.status(400).send({ status: false, message: "Pls provide email" })
    if (!password) return res.status(400).send({ status: false, message: "Pls provide password" })
    let user = await userModel.findOne({ email, password })
    if (!user) return res.status(401).send({ status: false, message: "username or the password is not corerct" })
    console.log(user)
    let token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "xyz", {

      expiresIn: '24h' // expires in 24 hours

    }
    );
    res.setHeader("x-auth-token", token);
    return res.status(201).send({ status: true, data: { token: token } });
  }
  catch (error) {
    return res.status(500).send({ status: false, data: error.message })
  }
}
module.exports.userCreate = userCreate
module.exports.userLogin = userLogin
