const mongoose = require('mongoose')

const Schema = mongoose.Schema
const subscribeSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function(value) {
                return /\w+@+\w+\.\w/.test(value)
            },
            message: "Please insert a valid mail"
        },
        required: true,
        unique: true
    },
})

const Subscibe = mongoose.model('Subscibe', subscribeSchema, 'Subscriptions')

module.exports = Subscibe