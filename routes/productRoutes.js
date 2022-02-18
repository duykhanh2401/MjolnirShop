const router = require('express').Router();
const productController = require(`${__dirname}/../controllers/productController`);
const authController = require(`${__dirname}/../controllers/authController`);
const adminController = require(`${__dirname}/../controllers/adminController`);

router
	.route('/')
	.get(productController.getAllProducts)
	.post(productController.createProduct);
router
	.route('/:id')
	.get(productController.getProduct)
	.patch(adminController.protect, productController.updateProduct)
	.delete(adminController.protect, productController.deleteProduct);
module.exports = router;
