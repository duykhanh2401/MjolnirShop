const router = require('express').Router();
const cartController = require(`${__dirname}/../controllers/cartController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.post('/addProduct', authController.protect, cartController.addProduct);
router.delete(
	'/removeProduct',
	authController.protect,
	cartController.removeProduct,
);
router.get('/', authController.protect, cartController.getCart);

module.exports = router;
