const bcrypt = require('bcrypt')
const saltRounds = 10;

function encrypt (password) {
    return new Promise(function(resolve, reject) {
        if(password) {
            //hash password
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if(err) {
                    reject("Error in encrypting, Please try again")

                } else {
                    resolve(hash)
                }
          });
        } else {
            reject("Password required")
        }
    })
}
module.exports = encrypt