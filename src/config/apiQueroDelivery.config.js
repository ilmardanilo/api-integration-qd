const axios = require('axios')
require('dotenv').config()

const apiQueroDelivery = axios.create({
    baseURL: 'https://stageapi.quero.io',
    headers: {
        Authorization: `Basic ${process.env.QD_TOKEN}`
    },
    params: {
        placeId: process.env.PLACE_ID
    }
})

module.exports = apiQueroDelivery