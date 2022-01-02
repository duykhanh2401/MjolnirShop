const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Nội dung đánh giá trống'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Người đánh giá không tồn tại'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: [true, 'Sản phẩm đánh giá không tồn tại'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
