const express = require('express')
const app = express()
const axios = require('axios')
require('dotenv').config()

const apiSystemMercado = axios.create({
    baseURL: `https://challenge-quero-delivery.herokuapp.com/${process.env.PLACE_ID}/products`,
    headers: {
        Authorization: `Basic ${process.env.SM_TOKEN}`
    }
})

const apiQueroDelivery = axios.create({
    baseURL: 'https://stageapi.quero.io',
    headers: {
        Authorization: `Basic ${process.env.QD_TOKEN}`
    },
    params: {
        placeId: process.env.PLACE_ID
    }
})

app.listen(8080, () => console.log("Server ON"))