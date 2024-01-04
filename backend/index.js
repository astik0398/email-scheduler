const express = require('express')
const {cors} = require('cors')
const app = express()
require('dotenv').config()
app.use(express())
app.use(express.json())
app.use(cors())

const {connection} = require('./db')
const {productRouter} = require('./routes/product.router')

app.use('/products', productRouter)


app.listen(process.env.PORT, async()=>{
    try {
        await connection
    console.log('connected to the db');
    console.log(`server running at port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
})
