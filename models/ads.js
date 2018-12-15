const mongoose = require('mongoose')

const Schema = mongoose.Schema
const adsSchema = new Schema({
    link: {
        type: String,
        required: true
    }
})

const Ads = mongoose.model('Advertisement', adsSchema, 'Advertisements')

module.exports = Ads