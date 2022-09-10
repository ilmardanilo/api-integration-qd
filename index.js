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

// Cadastrar todos os produtos do ERP no aplicativo
app.post('/produto', async (req, res) => {
    try {

        function listaProdutosERP() {
            return apiSystemMercado.get('/')
        }
    
        const dados = await listaProdutosERP()

        const produtos = dados.data.products

        produtos.forEach(async prod => {
            let produto = {
                nome: prod.name,
                categoriaId: "63192ad7a7e10600450b42f8",
                status: "",
                preco: prod.price,
                precoAntigo: 0,
                codigoBarras: prod.barCode,
                isPesavel: prod.isHeavy,
                isPromocao: true,
                isSazonal: false
            }

            if (prod.isActive == false) {
                produto.status = "OCULTO"
            } else if (prod.isActive == true && prod.stock > 0) {
                produto.status = "ATIVO"
            } else {
                produto.status = "EM FALTA"
            }

            await apiQueroDelivery.post('/produto', produto)

        })

        res.status(201).json({message: 'Produto(s) cadastrado(s) com sucesso!'})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Atualizar todos os estoques dos produtos buscando do ERP, para o aplicativo
app.put('/produto/estoque', async (req, res) => {
    try {
        
        function listaProdutosERP() {
            return apiSystemMercado.get('/')
        }
    
        const dados = await listaProdutosERP()

        const produtos = dados.data.products

        produtos.forEach(async prod => {
            let produto = {
                quantidade: prod.stock
            }

            let codigoBarra = prod.barCode

            await apiQueroDelivery.put(`/produto/lancar-estoque?codigoBarras=${codigoBarra}`, produto)

        })

        res.status(200).json({message: "Estoque dos produtos atualizado com sucesso!"})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

app.listen(8080, () => console.log("Server ON"))