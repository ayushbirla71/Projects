const coinModal = require('./model')
const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/assets', async (req, res) => {
    try {
        let token=req.headers[`authorization`]
        const options = {
            method: 'get',
            url: "https://api.coincap.io/v2/assets",
            headers: { Authorization: `Bearer ${token}` }
        }
        let data =await axios(options)
            .then((res) => {
                return res.data.data
            })
            .catch(() => {
                return false
            })

        if (!data) { return res.status(400).send({ status: false, message: "Axios data not found" }) }
        let data1 = data.sort((a, b) => {
            return b.changePercent24Hr - a.changePercent24Hr;
        })
        await coinModal.deleteMany()
        let getdata = await coinModal.insertMany(data1)
        return res.status(201).send({ status: true, data: getdata })
    }
    catch (error) {
        return res.status(500).send({ status: false, massg: error.message })
    }
})
module.exports = router;
