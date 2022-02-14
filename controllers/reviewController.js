const Review = require(`${__dirname}/../models/reviewModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);

exports.getAllReviews = factory.getAll(Review);

exports.createReview = catchAsync(async (req, res, next) => {
	const { idProduct, review, rating } = req.body;
	const data = await Review.create({
		user: req.user.id,
		review: review,
		rating: rating,
		product: idProduct,
	});
	res.json({ idProduct, review, rating, user: req.user });
});
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
