const Product = require('../models/productModels');
const Category = require('../models/categoryModels');
const User = require('../models/userModels');
const Author = require('../models/authorModels');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.getProduct = async (req, res, next) => {
	const categories = await Category.find().select('name slug ');
	const authors = await Author.find().select('name slug ');

	// console.log(categories, authors);
	res.status(200).render('admin/product', { categories, authors });
	// res.status(200).json({ category });
};

exports.getCategory = async (req, res, next) => {
	res.status(200).render('admin/category');
};

exports.getAuthor = async (req, res, next) => {
	res.status(200).render('admin/author');
};

exports.getUser = async (req, res, next) => {
	res.status(200).render('admin/user');
};

exports.getOrder = async (req, res, next) => {
	res.status(200).render('admin/order');
};

exports.getOverview = async (req, res, next) => {
	res.status(200).render('admin/overview');
};

exports.logoutAdmin = (req, res, next) => {
	res.cookie('jwt_admin', 'logouttoken', {
		httpOnly: true,
		expires: new Date(Date.now() + 5000),
	});

	res.status(200).json({
		status: 'success',
	});
};

exports.protect = async (req, res, next) => {
	try {
		let token;
		if (req.cookies.jwt_admin) {
			token = req.cookies.jwt_admin;
			console.log(token);
		}
		if (!token) {
			return res.redirect(`/admin/login`);
		}

		const decode = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET,
		);
		const currentUser = await User.findById(decode.id);
		if (!currentUser) {
			return res.redirect(`/admin/login`);
		}

		if (currentUser.role !== 'admin') {
			return res.redirect(`/admin/login`);
		}

		return next();
	} catch (error) {
		return res.redirect(`/admin/login`);
		// return res.status(200).render('admin/login');
	}
};

exports.login = async (req, res, next) => {
	try {
		let token;
		if (req.cookies.jwt_admin) {
			token = req.cookies.jwt_admin;
		}
		if (!token) {
			return res.status(200).render('admin/login');
		}
		const decode = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET,
		);
		const currentUser = await User.findById(decode.id);
		if (!currentUser) {
			return res.status(200).render('admin/login');
		}

		if (currentUser.role !== 'admin') {
			return res.status(200).render('admin/login');
		}
	} catch (error) {
		return res.status(200).render('admin/login');
	}

	res.redirect('/admin');
};
