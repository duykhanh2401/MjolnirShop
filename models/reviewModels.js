const mongoose = require('mongoose');
const validator = require('validator');
const Product = require(`${__dirname}/productModels`);
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
		name: {
			type: String,
			required: [true, 'Vui lòng nhập tên của bạn'],
		},
		email: {
			type: String,
			required: [true, 'Vui lòng nhập email của bạn'],
			lowercase: true,
			validate: [validator.isEmail, 'Đây không phải là email'],
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

reviewSchema.index({ product: 1, email: 1 }, { unique: true });

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
	console.log(stats);
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
