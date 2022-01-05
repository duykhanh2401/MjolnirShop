const Product = require('../models/productModels');
const Category = require('../models/categoryModels');

exports.getProduct = async (req, res, next) => {
	const products = await Product.find();
	res.status(200).render('admin/product', { products });
	// res.status(200).json({ products: products });
};

exports.getCategory = async (req, res, next) => {
	res.status(200).render('admin/category');
};

exports.getAuthor = async (req, res, next) => {
	res.status(200).render('admin/author');
};
