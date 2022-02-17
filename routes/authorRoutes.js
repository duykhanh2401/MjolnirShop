const router = require('express').Router();
const authorController = require(`${__dirname}/../controllers/authorController`);
const authController = require(`${__dirname}/../controllers/authController`);

router
	.route('/')
	.get(authorController.getAllAuthor)
	.post(
		authController.protect,
		authController.restrictTo('admin'),
		authorController.createAuthor,
	);

router
	.route('/:id')
	.get(authorController.getAuthor)
	.patch(
		authController.protect,
		authController.restrictTo('admin'),
		authorController.updateAuthor,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		authorController.deleteAuthor,
	);

module.exports = router;
