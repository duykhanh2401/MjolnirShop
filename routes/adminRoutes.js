const router = require('express').Router();
const adminController = require(`${__dirname}/../controllers/adminController`);
router.get('/login', adminController.login);

router.use(adminController.protect);

router.get('/product', adminController.getProduct);
router.get('/category', adminController.getCategory);
router.get('/author', adminController.getAuthor);
router.get('/user', adminController.getUser);
router.get('/order', adminController.getOrder);
router.get('/', adminController.getOverview);
module.exports = router;
