const User = require('../models/user')

function isUserExist(req, res, next) {
    User
        .findOne({
            email: req.body.email
        })
        .then(user => {
            if(user) {
                req.user_signing = user
                next()
            } else {
                res.status(400).json({message: "User not found"})
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: err.message, note:"please see console for details"})
        })
}

module.exports = isUserExist