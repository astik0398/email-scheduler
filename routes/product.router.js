const express = require('express')
const {productModal} = require('../model/product.modal')
const productRouter = express.Router()

productRouter.post('/', async(req, res)=> {
    try {
        const product = new productModal({
            name: req.body.name,
            picture: req.body.picture,
            description: req.body.description,
            gender: req.body.gender,
            category: req.body.category,
            price: req.body.price,
            created_at: new Date().toString(),
            updated_at: new Date().toString(),
        })

        await product.save()
        res.status(201).send(product)

    } catch (error) {
        res.send({"error": error})
    }
})

productRouter.get('/', async(req, res)=> {
    try {
        const products = await productModal.find()
        res.status(200).send(products)
    } catch (error) {
        res.send({"error": error})
    }
})

productRouter.get('/:_id', async(req, res)=> {
    const {_id} = req.params
    try {
        const singleProduct = await productModal.findById({_id})
        res.status(200).send(singleProduct)
    } catch (error) {
        res.send({"error": error})
    }
})

productRouter.patch('/:_id', async(req, res)=> {

    const {_id} = req.params
    try {
        await productModal.findByIdAndUpdate({_id}, req.body)
        res.status(204).send({"message": `product with id ${_id} has been updated`})
    } catch (error) {
        res.send({"error": error})
    }
})

productRouter.delete('/:_id', async(req, res)=> {
    const {_id} = req.params
    try {
        await productModal.findByIdAndDelete({_id})
        res.status(202).send({"message": `product with id ${_id} has been deleted`})
    } catch (error) {
        res.send({"error": error})
    }
})

module.exports = {
    productRouter
}