const Product = require('../models/productModels');

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

exports.getOverview = async (req, res, next) => {
	const products = await Product.find();
	products.forEach((el) => {
		el.priceFormat = formatter.format(el.price);
	});
	res.status(200).render('home', { products });
};

exports.getProduct = async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.id });
	product.priceFormat = formatter.format(product.price);
	res.status(200).render('product', { product });
};
