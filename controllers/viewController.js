const Product = require('../models/productModels');
const Order = require('../models/orderModels');
const Category = require('../models/categoryModels');
const Author = require('../models/authorModels');
const Cart = require('../models/cartModels');
function removeAccents(str) {
	var AccentsMap = [
		'aàảãáạăằẳẵắặâầẩẫấậ',
		'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
		'dđ',
		'DĐ',
		'eèẻẽéẹêềểễếệ',
		'EÈẺẼÉẸÊỀỂỄẾỆ',
		'iìỉĩíị',
		'IÌỈĨÍỊ',
		'oòỏõóọôồổỗốộơờởỡớợ',
		'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
		'uùủũúụưừửữứự',
		'UÙỦŨÚỤƯỪỬỮỨỰ',
		'yỳỷỹýỵ',
		'YỲỶỸÝỴ',
	];
	for (var i = 0; i < AccentsMap.length; i++) {
		var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
		var char = AccentsMap[i][0];
		str = str.replace(re, char);
	}
	return str.toLowerCase();
}
const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

exports.getOverview = async (req, res, next) => {
	const products = await Product.find().sort('-createdAt');

	products.forEach((el) => {
		el.priceFormat = formatter.format(el.price);
	});
	res.status(200).render('home', { products });
};

exports.getProduct = async (req, res, next) => {
	const category = await Category.findOne({
		slug: req.params.category,
	}).populate('products');
	if (category) {
		const inCategory = category.products.some(
			(product) => product.slug === req.params.id,
		);

		if (inCategory) {
			const product = await Product.findOne({
				slug: req.params.id,
			}).populate('reviews');
			product.priceFormat = formatter.format(product.price);
			product.reviews.forEach((review) => {
				review.timeReview = review.createdAt.toLocaleDateString('vi');
			});
			return res.status(200).render('product', { product });
		}
	}
	return res.status(404).render('404');
};

exports.getCart = async (req, res, next) => {
	if (req.user) {
		return res.status(200).render('cart');
	}

	return res.redirect('/');
};

exports.checkOut = async (req, res, next) => {
	if (req.user) {
		const cartUser = await Cart.findOne({ user: req.user._id });

		if (cartUser.products.length == 0) {
			return res.redirect('/');
		}
		return res.status(200).render('checkout');
	}

	return res.redirect('/');
};

exports.getCategory = async (req, res, next) => {
	const category = await Category.find({
		slug: req.params.category,
	}).populate({ path: 'products', options: { sort: '-createdAt' } });
	if (category.length > 0) {
		const products = category[0].products;
		products.forEach((el) => {
			el.priceFormat = formatter.format(el.price);
		});
		res.status(200).render('category', {
			products,
			name: category[0].name,
		});
	} else {
		res.render('404');
	}
};

exports.getAuthor = async (req, res, next) => {
	const author = await Author.find({
		slug: req.params.author,
	}).populate({ path: 'products', options: { sort: '-createdAt' } });
	if (author.length > 0) {
		const products = author[0].products;
		products.forEach((el) => {
			el.priceFormat = formatter.format(el.price);
		});
		res.status(200).render('category', {
			products,
			name: author[0].name,
		});
	} else {
		res.render('404');
	}
};

exports.search = async (req, res, next) => {
	const search = req.query.q;
	const products = await Product.find();
	if (search) {
		const arr = products.filter((item) => {
			return removeAccents(item.name).includes(removeAccents(search));
		});
		arr.forEach((el) => {
			el.priceFormat = formatter.format(el.price);
		});
		res.render('category', {
			products: arr,
			name: `Kết quả tìm kiếm cho: ${search}`,
		});
	} else {
		res.render('category', {
			products,
			name: `Tất cả sản phẩm`,
		});
	}
};

const getStatus = (input) => {
	switch (input) {
		case 'Order Placed':
			return 'Chờ xác nhận';
		case 'Order Confirmed':
			return 'Đã xác nhận';
		case 'Shipped Out':
			return 'Đang vận chuyển';
		case 'Order Received':
			return 'Đã nhận hàng';
		case 'Cancel The Order':
			return 'Huỷ đơn hàng';
	}
};

exports.getMe = async (req, res, next) => {
	if (req.user) {
		const id = req.user.id;
		const order = await Order.find({ idUser: id });
		order.forEach((item) => {
			item.idOrder = item._id.toString().slice(7);
			item.time = item.createdAt.toLocaleDateString('vi-VI');
			item.statusText = getStatus(item.status);
			item.priceFormat = formatter.format(item.priceTotal);
		});
		return res.render('me', { order });
	}
	return res.redirect('/');
	// res.json({ order });
};
