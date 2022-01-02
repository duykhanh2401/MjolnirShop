const router = require('express').Router();
const categoryController = require(`${__dirname}/../controllers/categoryController`);
const authController = require(`${__dirname}/../controllers/authController`);

router.route('/').get(categoryController.getAllCategories).post(
	// authController.protect,
	// authController.restrictTo('admin'),
	categoryController.createCategory,
);

router
	.route('/:id')
	.get(categoryController.getCategory)
	.patch(
		// authController.protect,
		// authController.restrictTo('admin'),
		categoryController.updateCategory,
	)
	.delete(
		// authController.protect,
		// authController.restrictTo('admin'),
		categoryController.deleteCategory,
	);

module.exports = router;
