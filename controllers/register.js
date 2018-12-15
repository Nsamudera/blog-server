const User = require('../models/user')
const Subscribe = require('../models/subscription')
require('dotenv').config()
//helpers
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const encrypt = require('../helpers/development/encrypt')
const sendEmail = require('../helpers/development/nodemailer')

class Controller {
    static signup(req, res) {
        encrypt(req.body.password)
            .then(hash => {
                //create User in DB
                User
                    .create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                    })
                    .then(user => {
                        res.status(201).json({message:"User created", data: user})
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ message: err.message, note: 'Please see console log for details' })
                    })
            })
            .catch((msg => {
                res.status(500).json({message: msg})
            }))
    }
    static signin(req, res) {
        //check password
        bcrypt.compare(req.body.password, req.user_signing.password, function(err, result) {
            if(err) {
                res.status(500).json({message: "Error in decrypting password"})
            } else {
                if(result) {
                    //give token
                    let content = {
                        name: req.user_signing.name,
                        email: req.user_signing.email,
                    }
                    let token = jwt.sign(content, process.env.JWT_secret)
                    res.status(200).json({message:"Sign in success", token:token, name: req.user_signing.name})
                } else {
                    res.status(400).json({message: "Password invalid"})
                }
            }
        });
    }
    static decode(req, res) {
        res.status(200).json({name: req.currentUser.name, id: req.currentUser._id})
    }
    static subscribe(req, res) {
        Subscribe
            .create({
                email: req.body.email
            })
            .then(user => {
                let name = req.body.email.split('@')[0]
                sendEmail(
                        req.body.email, 
                        'Welcome to the Blog Family', 
                        `<p style="font-size:16px"><b>Hi ${name}</b>,</p> <p>We are so happy that you subscribed "The Blog". <br> Welcome, and we'll let you know whenever a new article has been publsihed.</p> <p style="font-size:14px">The Blog Team</p>`
                        )
                res.status(201).json({message: "Thank You for subscribing! Please check you email for confirmation."})
            })
            .catch((err => {
                console.log(err)
                res.status(500).json({message: err})
            }))
    }
}

module.exports = Controller