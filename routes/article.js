const router = require('express').Router()
const Controller = require('../controllers/article')
const isLogin = require('../middlewares/isLogin')
const isAuthorized = require('../middlewares/isAuthorized')

router.get('/', Controller.viewAll)
router.get('/user', isLogin, Controller.viewUserArticles)
router.get('/:articleId', Controller.viewArticle)

router.use(isLogin)

router.post('/', Controller.createArticle)
router.put('/:articleId', isAuthorized, Controller.editArticle)
router.delete('/:articleId', isLogin, isAuthorized, Controller.deleteArticle)



module.exports = router