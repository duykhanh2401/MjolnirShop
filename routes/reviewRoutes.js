const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(reviewController.createReview);

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(
		authController.protect,
		authController.restrictTo('admin'),
		reviewController.updateReview,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		reviewController.deleteReview,
	);

module.exports = router;
