const router = require('express').Router()
const Controller = require('../controllers/comment')
const isLogin = require('../middlewares/isLogin')
const isAuthorized = require('../middlewares/isAuthorized')

router.get('/', Controller.viewAll)
router.use(isLogin)
router.get('/user', Controller.viewUserComments)
router.post('/:articleId', Controller.createComment)
router.delete('/:commentId', isAuthorized, Controller.deleteComment)





module.exports = router