const router = require('express').Router()
const Controller = require('../controllers/ads')
const isLogin = require('../middlewares/isLogin')

router.post('/', isLogin, Controller.addAds)
router.get('/', Controller.getAds)

module.exports = router