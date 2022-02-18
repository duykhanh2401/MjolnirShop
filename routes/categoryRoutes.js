const router = require('express').Router();
const categoryController = require(`${__dirname}/../controllers/categoryController`);
const adminController = require(`${__dirname}/../controllers/adminController`);

router
	.route('/')
	.get(categoryController.getAllCategories)
	.post(adminController.protect, categoryController.createCategory);

router
	.route('/:id')
	.get(categoryController.getCategory)
	.patch(adminController.protect, categoryController.updateCategory)
	.delete(adminController.protect, categoryController.deleteCategory);

module.exports = router;
