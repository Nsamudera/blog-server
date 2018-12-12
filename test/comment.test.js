const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app.js')

const Comment = require('../models/comment')
const User = require('../models/user')
const Article = require('../models/article')
const moment = require('moment')
const jwt = require('jsonwebtoken')

let userId = ""
let articleId = ""
let commentId = ""
let token = ''


// console.log(process.env.NODE_ENV)


describe("Comments Test", function () {
    before((done) => {
        User    
            .create({
                name: "one",
                email: "one@mail.com",
                password: "one"
            })
            .then(user => {
                let content = {
                    name: user.name,
                    email: user.email,
                }
                token = jwt.sign(content, process.env.JWT_secret)
                userId = user._id
                //create dummy article
                Article
                    .create({
                        name: "Dummy Article",
                        body: "This is a dummy Article",
                        createdDate: moment().format('MMM D, YYYY'),
                        updatedDate: moment().format('MMM D, YYYY'),
                        author: userId,
                        comments: []
                    })
                    .then(article => {
                        articleId = article._id
                        Comment
                            .create({
                                comment: "Dummy Comment",
                                author: "One",
                                authorId: userId,
                                createdDate: moment().format('MMM D, YYYY'),
                                articleId: articleId
                            })
                            .then(comment => {
                                commentId = comment._id
                                done()
                            })
                    })
            })
    })

    after((done) => {
        Article.remove({}, () => {
            User.remove({}, () => {
                Comment.remove({}, () => {
                    done()
                    })
            })
        })
        // done()

    })

    it('should return <array of object> containing comment data', function(done) {
    chai
        .request(app)
        .get('/comments')
        .end(function (err, res) {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.have.property('_id')
            expect(res.body[0]).to.have.property('createdDate')
            expect(res.body[0]).to.have.property('comment')
            expect(res.body[0]).to.have.property('author')
            expect(res.body[0]).to.have.property('authorId')
            expect(res.body[0]).to.have.property('articleId')
            expect(res.body[0].comment).to.be.a('string')
            expect(res.body[0].author).to.be.a('string')
            done()
        })
    })

    it('should return <array of object> containing a single user comments data', function(done) {
    chai
        .request(app)
        .get(`/comments/user`)
        .set('token', token )
        .end(function (err, res) {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.have.property('_id')
            expect(res.body[0]).to.have.property('createdDate')
            expect(res.body[0]).to.have.property('comment')
            expect(res.body[0]).to.have.property('author')
            expect(res.body[0]).to.have.property('authorId')
            expect(res.body[0]).to.have.property('articleId')
            expect(res.body[0].comment).to.be.a('string')
            expect(res.body[0].author).to.be.a('string')
            done()
        })
    })
    it("should return 'Please sign in' if no token is given", function (done) {
        chai
            .request(app)
            .get("/comments/user")
            .set('token', '' )
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })

    it('should return <array of object> when a user successfully creates a comment', function(done) {
        chai
            .request(app)
            .post(`/comments/${articleId}`)
            .set('token', token )
            .send({comment:"Comment 1 XXXXXXXX"})
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('_id')
                expect(res.body).to.have.property('createdDate')
                expect(res.body).to.have.property('comment')
                expect(res.body).to.have.property('author')
                expect(res.body).to.have.property('authorId')
                expect(res.body).to.have.property('articleId')
                expect(res.body.authorId).to.equal(String(userId))
                done()
            })
    })
    it("should return 'Please sign in' if no token is given", function(done) {
        chai
            .request(app)
            .post(`/comments/${articleId}`)
            .set('token', '' )
            .send({comment:"Comment 1 XXXXXXXX"})
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })
    it("should return 'Comment deleted' if article is successfully deleted", function (done) {
        chai
            .request(app)
            .delete(`/comments/${commentId}`)
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Comment deleted")
                done()
            })
    })

    it("should return 'Please sign in' if no token is given", function (done) {
        chai
            .request(app)
            .delete(`/comments/${commentId}`)
            .set('token', '' )
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })

})