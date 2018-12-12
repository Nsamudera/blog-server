const User = require('../../models/user')
const encrypt = require('../development/encrypt') 

function createDummyUser(done) {
    encrypt('bob')
        .then(hash => {
            return User
                    .create({
                        name: "Bob",
                        password: hash,
                        email: "bob@mail.com"
                    })
                    .then(function() {
                        console.log('created bob');
                        done()
                    })
        })
        .catch(err => {
            console.log(err)
        })
    
}

module.exports = createDummyUser