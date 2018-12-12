const Article = require('../models/article')
const Comment = require('../models/comment')


function isAuthorized(req, res, next) {
    if(req.params.articleId) {
        Article
            .findOne({
                _id: req.params.articleId
            })
            .then(article => {
                if(String(article.author) == req.currentUser._id) {
                    next()
                } else {
                    res.status(401).json({message: "You are not the owner"})
                }
            })

    } else if(req.params.commentId) {
        Comment
        .findOne({
            _id: req.params.commentId
        })
        .then(comment => {
            if(String(comment.authorId) == req.currentUser._id) {
                next()
            } else {
                console
                res.status(401).json({message: "You are not the owner"})
            }
        })
    }


}

module.exports = isAuthorized