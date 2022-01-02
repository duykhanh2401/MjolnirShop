const Cart = require(`${__dirname}/../models/cartModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

exports.addProduct = catchAsync(async (req, res, next) => {
	//1) Kiểm tra người dùng trong giỏ hàng có sản phẩm chưa

	const { product, quantity } = req.body;
	const cartUser = await Cart.findOne({ user: req.user._id });
	req.body.user = req.user._id;
	if (!cartUser) {
		const cart = await Cart.create(req.body);
		return res.status(200).json({
			status: 'success',
			cart,
		});
	}
	let inCart = false;
	//2) Kiểm tra sản phẩm có trong giỏ hàng hay k
	cartUser.products.forEach((el) => {
		if (el.product._id == product) {
			if (quantity) el.quantity = el.quantity + quantity;
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
			data,
		});
	} else {
		cartUser.products.push({ product: product, quantity });
		await cartUser.save();
		res.status(200).json({
			status: 'success',
			data: cartUser.products,
		});
	}
});

exports.removeProduct = catchAsync(async (req, res, next) => {
	const cartUser = await Cart.findOne({ user: req.user._id });

	cartUser.products = cartUser.products.filter((item) => {
		return item.product._id != req.body.product;
	});

	// console.log(cartUser.products);
	await cartUser.save();
	res.status(200).json({
		status: 'success',
	});
});

exports.getCart = catchAsync(async (req, res, next) => {
	const cartUser = await Cart.findOne({ user: req.user._id });

	if (!cartUser) {
		return res.status(200).json({
			status: 'success',
			data: 'Giỏ hàng trống',
		});
	}

	res.status(200).json({
		status: 'success',
		data: cartUser,
	});
});
