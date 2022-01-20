const Cart = require(`${__dirname}/../models/cartModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

exports.addProduct = catchAsync(async (req, res, next) => {
	//1) Kiểm tra người dùng trong giỏ hàng có sản phẩm chưa

	const { product, quantity } = req.body;
	const cartUser = await Cart.findOne({ user: req.user._id });
	req.body.user = req.user._id;
	if (!cartUser) {
		await Cart.create({
			user: req.user._id,
			products: [
				{
					product: product,
					quantity: quantity,
				},
			],
		});
		const newCart = await Cart.findOne({ user: req.user._id });
		return res.status(200).json({
			status: 'success',
			data: newCart.products,
		});
	}
	let inCart = false;
	//2) Kiểm tra sản phẩm có trong giỏ hàng hay k
	cartUser.products.forEach((el) => {
		if (el.product._id == product) {
			if (quantity) el.quantity = el.quantity * 1 + quantity * 1;
			else {
				el.quantity = el.quantity + 1;
			}
			inCart = true;
		}
	});

	if (inCart) {
		const data = await cartUser.save();
		res.status(200).json({
			status: 'success',
			data: data.products,
		});
	} else {
		cartUser.products.push({ product: product, quantity });
		await cartUser.save();
		const newCart = await Cart.findOne({ user: req.user._id });
		res.status(200).json({
			status: 'success',
			data: newCart.products,
		});
	}
});

exports.removeProduct = catchAsync(async (req, res, next) => {
	const cartUser = await Cart.findOne({ user: req.user._id });

	cartUser.products = cartUser.products.filter((item) => {
		return item.product._id != req.body.product;
	});

	await cartUser.save();
	const newCart = await Cart.findOne({ user: req.user._id });
	res.status(200).json({
		status: 'success',
		data: newCart.products,
	});
});

exports.getCart = catchAsync(async (req, res, next) => {
	const cartUser = await Cart.findOne({ user: req.user._id });

	if (!cartUser) {
		return res.status(200).json({
			status: 'success',
			data: [],
		});
	}

	res.status(200).json({
		status: 'success',
		data: cartUser.products,
	});
});
