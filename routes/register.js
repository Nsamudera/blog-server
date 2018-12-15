const router = require('express').Router()
const Controller = require('../controllers/register')
const isUserExist = require('../middlewares/isUserExist')
const isLogin = require('../middlewares/isLogin')

router.post('/signup', Controller.signup)
router.post('/signin', isUserExist, Controller.signin)
router.get('/decode', isLogin, Controller.decode)
router.post('/subscribe', Controller.subscribe)

module.exports = router