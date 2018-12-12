const User = require('../../models/user')

function clearUser(done) {
    User
        .deleteMany({})
        .then(function() {
            done();
        })
        .catch(function(err) {
            console.log(err);
        });
}

module.exports = clearUser