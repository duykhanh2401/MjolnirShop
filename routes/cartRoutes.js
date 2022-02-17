const router = require('express').Router();
const cartController = require(`${__dirname}/../controllers/cartController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.use(authController.protect, authController.restrictTo('user'));
router.post('/addProduct', cartController.addProduct);
router.post('/removeProduct', cartController.removeProduct);
router.delete('/removeAllProducts', cartController.removeAllProducts);
router.get('/', cartController.getCart);

module.exports = router;
