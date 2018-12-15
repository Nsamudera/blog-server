const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app.js')

const User = require('../models/user')
const Article = require('../models/article')
const moment = require('moment')
const jwt = require('jsonwebtoken')

// console.log(process.env.NODE_ENV)

let userId = ""
let articleId = ""
let token = ''

describe("Article Test", function () {

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
                        done()
                    })
            })
    })

    after((done) => {
        Article.remove({}, () => {
          User.remove({}, () => {
            done()
          })
        })
        // done()
    })

    it('should return <array of object> containing article data', function(done) {
        chai
            .request(app)
            .get('/articles')
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('array')
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property('createdDate')
                expect(res.body[0]).to.have.property('updatedDate')
                expect(res.body[0]).to.have.property('comments')
                expect(res.body[0]).to.have.property('name')
                expect(res.body[0]).to.have.property('body')
                expect(res.body[0]).to.have.property('author')
                done()
            })
    })
    it('should return <array of object> containing a single user article data', function(done) {
        chai
            .request(app)
            .get(`/articles/user`)
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('array')
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property('createdDate')
                expect(res.body[0]).to.have.property('updatedDate')
                expect(res.body[0]).to.have.property('comments')
                expect(res.body[0]).to.have.property('name')
                expect(res.body[0]).to.have.property('body')
                expect(res.body[0]).to.have.property('author')
                expect(res.body[0].author).to.equal(String(userId))
                done()
            })
    })
    it('should return <array of object> when a user successfully creates an article', function(done) {
        chai
            .request(app)
            .post(`/articles`)
            .set('token', token )
            .send({name: "Article 1", body:"Article 1 XXXXXXXX"})
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('_id')
                expect(res.body).to.have.property('createdDate')
                expect(res.body).to.have.property('updatedDate')
                expect(res.body).to.have.property('comments')
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('body')
                expect(res.body).to.have.property('author')
                expect(res.body.author).to.equal(String(userId))
                done()
            })
    })
    it("should return 'Mongoose Validation error' if article name is empty", function (done) {
        chai
            .request(app)
            .post("/articles")
            .send({name: "", body:"Article 1 XXXXXXXX"})
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Article validation failed")
                done()
            })
    })
    it("should return 'Mongoose Validation error' if article body is empty", function (done) {
        chai
            .request(app)
            .post("/articles")
            .send({name: "Articel 1", body:""})
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Article validation failed")
                done()
            })
    })
    it("should return 'Please sign in' if no token is given when trying to create an article", function (done) {
        chai
            .request(app)
            .post("/articles")
            .send({name: "Articel 1", body:""})
            .set('token', '' )
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })
    it("should return <object> with edited value if article is edited", function (done) {
        let name = "Article 1 Edited"
        let body = "Edited Body"
        chai
            .request(app)
            .put(`/articles/${articleId}`)
            .send({name: name, body: body})
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('_id')
                expect(res.body).to.have.property('createdDate')
                expect(res.body).to.have.property('updatedDate')
                expect(res.body).to.have.property('comments')
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('body')
                expect(res.body).to.have.property('author') 
                expect(res.body.name).to.equal(name)
                expect(res.body.body).to.equal(body)
                done()
            })
    })
    it("should return 'Mongoose Validation error' if article body is empty for edit", function (done) {
        let name = "Article 1 Edited"
        let body = ""
        chai
            .request(app)
            .put(`/articles/${articleId}`)
            .send({name: name, body: body})
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Article validation failed")
                done()
            })
    })
    it("should return 'Mongoose Validation error' if article name is empty for edit", function (done) {
        let name = ""
        let body = "Edited Bddy"
        chai
            .request(app)
            .put(`/articles/${articleId}`)
            .send({name: name, body: body})
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Article validation failed")
                done()
            })
    })
    it("should return 'Please sign in' if no token is given when trying to edit an article", function (done) {
        chai
            .request(app)
            .put(`/articles/${articleId}`)
            .set('token', '' )
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })
    it("should return 'Article deleted' if article is successfully deleted", function (done) {
        chai
            .request(app)
            .delete(`/articles/${articleId}`)
            .set('token', token )
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("Article deleted")
                done()
            })
    })
    it("should return 'Please sign in' if no token is given when trying to delete an article", function (done) {
        chai
            .request(app)
            .delete(`/articles/${articleId}`)
            .set('token', '' )
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })
    it("should return <array of all articles> if no query is given during search", function (done) {
        let search = ""
        chai
            .request(app)
            .get(`/articles/search?search=${search}`)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property('createdDate')
                expect(res.body[0]).to.have.property('updatedDate')
                expect(res.body[0]).to.have.property('comments')
                expect(res.body[0]).to.have.property('name')
                expect(res.body[0]).to.have.property('body')
                expect(res.body[0]).to.have.property('author')
                done()
            })
    })
    it("should return <array of searched articles> if a valid query is given during search", function (done) {
        let search = "article"
        chai
            .request(app)
            .get(`/articles/search?search=${search}`)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property('createdDate')
                expect(res.body[0]).to.have.property('updatedDate')
                expect(res.body[0]).to.have.property('comments')
                expect(res.body[0]).to.have.property('name')
                expect(res.body[0].name.toLowerCase()).to.include(search.toLocaleLowerCase()) // lowered case, because the search will match regardless of case
                expect(res.body[0]).to.have.property('body')
                expect(res.body[0]).to.have.property('author')
                done()
            })
    })
    it("should return 'Search not Found' if an invalid query is given during search", function (done) {
        let search = "Protoss"
        chai
            .request(app)
            .get(`/articles/search?search=${search}`)
            .end(function (err, res) {
                expect(res).to.have.status(400)
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.equal("Search not Found")
                done()
            })
    })
})
