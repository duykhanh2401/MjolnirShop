const mongoose = require('mongoose');
const Product = require('./productModels');
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
			required: [true, 'Người dùng không tồn tại'],
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

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name -_id ',
	});
	// .populate({
	// 	path: 'tour',
	// 	select: 'name',
	// });

	next();
});
// this trong static method là tên class
reviewSchema.statics.calcAverageRatings = async function (ProductID) {
	const stats = await this.aggregate([
		{
			$match: { product: ProductID },
		},
		{
			$group: {
				_id: '$product',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);

	if (stats.length > 0) {
		await Product.findByIdAndUpdate(ProductID, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		await Product.findByIdAndUpdate(ProductID, {
			ratingsQuantity: 0,
			ratingsAverage: 0,
		});
	}
};

reviewSchema.post('save', function () {
	this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
	await this.r.constructor.calcAverageRatings(this.r.pporoduct);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
