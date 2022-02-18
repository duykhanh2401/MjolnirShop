const router = require('express').Router();
const authorController = require(`${__dirname}/../controllers/authorController`);
const adminController = require(`${__dirname}/../controllers/adminController`);

router
	.route('/')
	.get(authorController.getAllAuthor)
	.post(adminController.protect, authorController.createAuthor);

router
	.route('/:id')
	.get(authorController.getAuthor)
	.patch(adminController.protect, authorController.updateAuthor)
	.delete(adminController.protect, authorController.deleteAuthor);

module.exports = router;
