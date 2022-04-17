const Order = require(`${__dirname}/../models/orderModels`);
const Product = require(`${__dirname}/../models/productModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);
const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});
exports.createOrder = catchAsync(async (req, res, next) => {
	const products = await Product.find();
	const listUpdate = [];
	let priceTotal = 30000;
	for (let product of products) {
		for (let el of req.body.products) {
			if (product.id === el.product) {
				if (product.quantity < el.quantity) {
					return next(new AppError('Sản phẩm quá giới hạn cho phép', 400));
				}
			}
		}
	}

	products.forEach((product) => {
		req.body.products.forEach((el) => {
			if (product.id === el.product) {
				priceTotal = priceTotal + product.price * el.quantity;
				product.quantity = product.quantity - el.quantity;
				listUpdate.push({
					id: product.id,
					quantity: product.quantity,
					product,
				});
			}
		});
	});
	await Order.create({ ...req.body, priceTotal });

	if (listUpdate.length) {
		listUpdate.forEach(async (el) => {
			await Product.findByIdAndUpdate(el.id, { quantity: el.quantity });
		});
	}

	let totalPrice = 0;

	res.status(200).json({
		status: 'success',
	});
});
exports.getDashboardData = async (req, res) => {
	try {
		const orderReceived = await Order.aggregate([
			{
				$match: { status: 'Order Received' },
			},
			{
				$project: {
					sales: '$priceTotal',
					dateString: {
						$dateToString: {
							format: '%Y-%m-%d',
							date: '$createdAt',
						},
					},
				},
			},
			{
				$group: {
					_id: '$dateString',
					numberOrder: { $sum: 1 },
					total: { $sum: '$sales' },
					dateSort: { $first: '$dateString' },
				},
			},

			{
				$sort: { dateSort: 1 },
			},
		]);

		res.status(200).json(orderReceived);
	} catch (err) {
		res.status(500).json(err);
	}
};
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
