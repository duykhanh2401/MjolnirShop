const router = require('express').Router();
const productController = require(`${__dirname}/../controllers/productController`);
const authController = require(`${__dirname}/../controllers/authController`);

router
	.route('/')
	.get(productController.getAllProducts)
	.post(productController.createProduct);
router
	.route('/:id')
	.get(productController.getProduct)
	.patch(
		authController.protect,
		authController.restrictTo('admin'),
		productController.updateProduct,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		productController.deleteProduct,
	);
module.exports = router;
