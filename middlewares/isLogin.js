const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

function isLogin (req, res, next) {
    try {
        let decoded = jwt.verify(req.headers.token, process.env.JWT_secret)
        req.decoded = decoded
        //check if email exist in db
            User
            .findOne({
                email:req.decoded.email
            })
            .then((user) => {
                if(user) {
                    req.currentUser= user
                    next ()
                } else {
                    res.status(400).json({message: "User not found"})
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({message:err.message})
            })
    } catch (err) {
        res.status(401).json({message:'Please sign in'})
    }
}

module.exports = isLogin