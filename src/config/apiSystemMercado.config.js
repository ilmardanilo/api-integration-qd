const axios = require('axios')
require('dotenv').config()

const apiSystemMercado = axios.create({
    baseURL: `https://challenge-quero-delivery.herokuapp.com/${process.env.PLACE_ID}/products`,
    headers: {
        Authorization: `Basic ${process.env.SM_TOKEN}`
    }
})

module.exports = apiSystemMercado