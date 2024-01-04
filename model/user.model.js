const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
name: String,
avatar: String,
email: String,
password: String,
created_at: String,
updated_at: String
})

const userModal = mongoose.model('user', userSchema)

module.exports = {
    userModal
}