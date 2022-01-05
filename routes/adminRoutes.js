const router = require('express').Router();
const adminController = require(`${__dirname}/../controllers/adminController`);

router.get('/product', adminController.getProduct);
router.get('/category', adminController.getCategory);
router.get('/author', adminController.getAuthor);

module.exports = router;
