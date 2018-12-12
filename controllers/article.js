const Article = require('../models/article')
const User = require('../models/user')
const Comment = require('../models/comment')

const moment = require('moment')

class Controller {
    static viewAll(req, res) {
        Article
            .find()
            .populate('author')
            .then(article => {
                res.status(200).json(article)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static viewArticle(req, res) {
        Article
            .findOne({
                _id: req.params.articleId
            })
            .populate('author')
            .populate('comments')
            .then(article => {
                res.status(200).json(article)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static viewUserArticles(req, res) {
        Article
            .find({
                author: req.currentUser._id
            })
            .then((articles => {
                res.status(200).json(articles)
            }))
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static createArticle(req, res) {
        Article
            .create({
                author: req.currentUser._id,
                name: req.body.name,
                body: req.body.body,
                createdDate: moment().format('MMM D, YYYY'),
                updatedDate: moment().format('MMM D, YYYY'),
                comments: []
            })
            .then(newArticle => {
                //push article to user's articles property
                req.currentUser.articles.push(newArticle._id)
                return req.currentUser
                        .save()
                        .then(function() {
                            res.status(201).json(newArticle)
                        })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static editArticle(req, res) {
        Article
            .findOne({
                _id: req.params.articleId
            },)
            .then((article) => {
                article.name = req.body.name
                article.body = req.body.body
                article.updatedDate = moment().format('MMM D, YYYY')
                return article //to trigger model validation
                        .save()
                        .then(() => {
                            res.status(200).json(article)
                        })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static deleteArticle(req, res) {
        Article
            .deleteOne({
                _id: req.params.articleId
            })
            .then((response) => {
                // remove article from user's list
                let newArticleList = req.currentUser.articles

                let filtered = newArticleList.filter(article => String(article) != String(req.params.articleId))

                req.currentUser.articles = filtered
                return req.currentUser
                        .save()
                        .then(() => {
                            //delete all comments associated with deleted article
                            Comment
                                .deleteMany({
                                    articleId: req.params.articleId
                                })
                                .then(()=> {
                                    res.status(200).json({message: "Article deleted"})
                                })
                        })
            })
    }
    static searchArticle(req, res) {
        Article
            .find()
            .then(articles => {
                const regex = new RegExp(req.query.search, 'i')
                let filtered = articles.filter(datum => datum.name.match(regex))
                if(filtered.length === 0) {
                    res.status(400).json({message: "Search not Found"})
                } else {
                    res.status(200).json(filtered)
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: err.message, note: "Please see console for details" })
            })
    }
}

module.exports = Controller