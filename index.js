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

// Listar todos os produtos do aplicativo
app.get('/produto', async (req, res) => {

    try {
        function listaProdutos() {
            return apiQueroDelivery.get('/produto')
        }
    
        const dados = await listaProdutos()

        res.status(200).json(dados.data)
    } catch (error) {
        res.status(500).json({error: error})
    }
    
})

app.listen(8080, () => console.log("Server ON"))