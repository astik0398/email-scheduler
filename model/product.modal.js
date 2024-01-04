const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: String,
name: String,
picture: String,
description: String,
gender: String,
category: String,
price: String,
created_at: String,
updated_at: String,
})

const productModal = mongoose.model('product', productSchema)

module.exports = {
    productModal
}