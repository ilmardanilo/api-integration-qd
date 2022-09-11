const express = require('express')
const app = express()
const productRoutes = require('./src/routes/productRoutes')

app.use('/produto', productRoutes)

app.listen(8080, () => console.log("Server ON"))