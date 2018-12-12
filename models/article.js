const mongoose = require('mongoose')

const Schema = mongoose.Schema
const articleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdDate: {
        type: String,
    },
    updatedDate: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
	}]
})

const Article = mongoose.model('Article', articleSchema, 'Articles')

module.exports = Article