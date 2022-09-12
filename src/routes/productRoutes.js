const router = require('express').Router()
const apiQueroDelivery = require('../config/apiQueroDelivery.config')
const apiSystemMercado = require('../config/apiSystemMercado.config')

// Listar todos os produtos do aplicativo
router.get('/', async (req, res) => {

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
router.post('/', async (req, res) => {
    try {

        function listaProdutosERP() {
            return apiSystemMercado.get('/')
        }
    
        const dados = await listaProdutosERP()

        const produtos = dados.data.products

        produtos.forEach(prod => {
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

            apiQueroDelivery.post('/produto', produto).then().catch((error) => console.log(`Erro: ${error}`))

        })

        res.status(201).json({message: 'Produtos cadastrados com sucesso.'})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Atualizar todos os estoques dos produtos buscando do ERP, para o aplicativo
router.put('/estoque', async (req, res) => {
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

        res.status(200).json({message: "Estoque dos produtos atualizado com sucesso."})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Atualizar todos os preços dos produtos, buscando do ERP, para o aplicativo
router.put('/preco', async (req, res) => {
    try {
        
        function listaProdutosERP() {
            return apiSystemMercado.get('/')
        }
    
        const dados = await listaProdutosERP()

        const produtos = dados.data.products

        produtos.forEach(prod => {
            let produto = {
                preco: prod.price,
                precoAntigo: 10
            }

            let codigoBarra = prod.barCode

            apiQueroDelivery.put(`/produto/preco?codigoBarras=${codigoBarra}`, produto).then().catch((error) => console.log(`Erro: ${error}`))

        })

        res.status(200).json({message: "Preço dos produtos atualizado com sucesso."})
    } catch (error) {
        res.status(500).json(console.log("Erro: " + error))
    }
})

// Atualizar o preço, estoque e status de um produto específico no aplicativo, buscando os dados do ERP por código de barras
router.put('/:codigoBarra', async (req, res) => {
    const codigoBarra = req.params.codigoBarra

    try {

        function listaProdutosQD() {
            return apiQueroDelivery.get(`/produto?codigoBarras=${codigoBarra}`)
        }
    
        const dadosQD = await listaProdutosQD()

        if (dadosQD.data.r == false) {
            res.status(200).json({message: "Produto não existe."})
            return
        }

        function listaProdutosERP() {
            return apiSystemMercado.get(`/${codigoBarra}/barCode`)
        }
    
        const dadosERP = await listaProdutosERP()

        const produto = dadosERP.data

        let preco = produto.price
        let precoAntigo = 50
        let quantidade = produto.stock
        let status = ""
        if (produto.isActive == false) {
            status = "OCULTO"
        } else if (produto.isActive == true && produto.stock > 0) {
            status = "ATIVO"
        } else {
            status = "EM FALTA"
        }

        await apiQueroDelivery.put(`/produto/preco?codigoBarras=${codigoBarra}`, { preco: preco, precoAntigo: precoAntigo })
        await apiQueroDelivery.put(`/produto/lancar-estoque?codigoBarras=${codigoBarra}`, { quantidade: quantidade })
        await apiQueroDelivery.put(`/produto/status?codigoBarras=${codigoBarra}`, { status: status })

        res.status(200).json({message: "Preço, estoque e status do produto atualizado com sucesso."})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Deletar um produto específico no aplicativo por código de barras
router.delete('/:codigoBarra', async (req, res) => {
    const codigoBarra = req.params.codigoBarra

    try {

        function listaProdutos() {
            return apiQueroDelivery.get(`/produto?codigoBarras=${codigoBarra}`)
        }
    
        const dados = await listaProdutos()

        if (dados.data.r == false) {
            res.status(200).json({message: "Produto não existe."})
            return
        }

        await apiQueroDelivery.delete(`/produto?codigoBarras=${codigoBarra}`)

        res.status(200).json({message: "Produto removido com sucesso."})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router