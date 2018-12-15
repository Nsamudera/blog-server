const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app.js')

//helpers
const clearUser = require('../helpers/testing/clearUser')
const createDummy = require('../helpers/testing/createDummyUser')

// console.log(process.env.NODE_ENV)

before(function(done) {
    createDummy(done)
});

after(function(done) {
    clearUser(done)
})

describe("Signup Test", function () {
    it("should return 'Mongoose Duplicate error' if email is not unique", function (done) {
        chai
            .request(app)
            .post("/register/signup")
            .send({email: "bob@mail.com", password: "bob", name:"Bob"})
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("E11000 duplicate key error")
                done()
            })
    })
    it("should return 'Password required' if password is empty", function (done) {
        chai
            .request(app)
            .post("/register/signup")
            .send({email: "test@mail.com", password: "", name:"Tester"})
            .end(function (err, res) {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Password required")
                done()
            })
    })
    it("should return 'Mongoose Validation error' if name is empty", function (done) {
        chai
            .request(app)
            .post("/register/signup")
            .send({email: "noname@mail.com", password: "nonam", name:""})
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("User validation failed")
                done()
            })
    })

    it("should return 'Mongoose Validation error' if email is empty", function (done) {
        chai
            .request(app)
            .post("/register/signup")
            .send({email: "", password: "nonam", name:"NoName"})
            .end(function (err, res) {
                expect(res).to.have.status(500)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include("User validation failed")
                done()
            })
    })
    it("should return 'Successfully signed up' when signup is ok", function(done) {
        chai
            .request(app)
            .post("/register/signup")
            .send({email: "test@mail.com", password: "test", name:"Tester"})
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("User created")
                done()
            })
    })
})

describe("Sign in Tests:", function() {
    it("should return 'User not found' when email is not in database", function(done) {
        chai
            .request(app)
            .post('/register/signin')
            .send({email: "invalid@mail.com", password: "invalid"})
            .end(function (err, res) {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("User not found")
                done()
            })
    })
    it("should return 'Password invalid' when password is incorrect", function(done) {
        chai
            .request(app)
            .post('/register/signin')
            .send({email: "bob@mail.com", password: "wrong"})
            .end(function (err, res) {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Password invalid")
                done()
            })
    })
    it("should return 'Successfully logged in' when password is correct", function(done) {
        chai
            .request(app)
            .post('/register/signin')
            .send({email: "bob@mail.com", password: "bob"})
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Sign in success")
                expect(res.body).to.have.property('token');
                expect(res.body.token).to.be.a("string")
                expect(res.body).to.have.property('name');
                expect(res.body.token).to.be.a("string")
                done()
            })
    })
})

describe("Decoding Tests:", function() {
    it("should return 'Please sign in' when no token is provided", function(done) {
        chai
            .request(app)
            .get('/register/decode')
            .set('token', '')
            .end(function (err, res) {
                expect(res).to.have.status(401)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Please sign in")
                done()
            })
    })
    it("should return 'User not found' when token payload does not contain email in DB", function(done) {
        chai
            .request(app)
            .get('/register/decode')
            .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNTQzODI4MjgyfQ.cyfreUVtsnh6JX314_NHE3H-Ck5wz5Oyrzhe4enrDrU')
            .end(function (err, res) {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("User not found")
                done()
            })
    })
    it("should return <name> when decoding succeeds", function(done) {
        chai
            .request(app)
            .get('/register/decode')
            .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQm9iIiwiZW1haWwiOiJib2JAbWFpbC5jb20iLCJpYXQiOjE1NDQ0MjU5Mzh9.5skC1N3y9T2DODiToruyM8SyNC6iG5ZWTaD1deKZtfs')
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property("name");
                expect(res.body.name).to.be.a("string")
                done()
            })
    })
})