const Comment = require('../models/comment')
const Article = require('../models/article')
const mongoose= require('mongoose')

const moment = require('moment')

class Controller {
    static viewAll(req, res) {
        Comment
            .find()
            .populate({
                path: "articleId",
                populate: {
                    path: "author"
                }
            })
            .then(comments => {
                res.status(200).json(comments)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static viewUserComments(req, res) {
        Comment
            .find({
                authorId: req.currentUser._id
            })
            .populate({
                path: "articleId",
                populate: {
                    path: "author"
                }
            })
            .then((comments => {
                res.status(200).json(comments)
            }))
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static createComment(req, res) {
        Comment
            .create({
                comment: req.body.comment,
                authorId: req.currentUser._id,
                author: req.currentUser.name,
                createdDate: moment().format('MMM D, YYYY'),
                articleId: req.params.articleId
            })
            .then(comment => {
                //push new comment Id to article "comments" property
                return Article
                            .findOne({
                                _id: req.params.articleId
                            })
                            .then(article => {
                                article.comments.push(comment._id)
                                return article
                                        .save()
                                        .then(() => {
                                            console.log('-----',article)
                                            res.status(201).json(comment)
                                        })
                            })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static deleteComment(req, res) {
        Comment
            .findOneAndDelete({
                _id: req.params.commentId
            })
            .then((comment) => {
                //delete comment from Articles
                return Article
                        .findOne({
                            _id: comment.articleId
                        })
                        .then(article => {
                            let newCommentList = article.comments
                            let filtered = newCommentList.filter(comment => String(comment) != req.params.commentId)
                            article.comments = filtered
                            return article 
                                    .save()
                                    .then(() => {
                                        res.status(200).json({message: "Comment deleted"})
                                    })
                        })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
}

module.exports = Controller