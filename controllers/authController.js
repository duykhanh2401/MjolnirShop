const User = require(`${__dirname}/../models/userModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = createToken(user._id);

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRES_IN * 60 * 24 * 60 * 1000,
		),
	});

	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		token,
	});
};

exports.register = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name.trim(),
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});
	createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	// 1) Check Email Password nhập vào
	if (!email || !password)
		return next(new AppError('Please provide email or password', 400));

	// 2) Check Email Password đúng hay k
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 400));
	}

	createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
	res.cookie('jwt', 'logouttoken', {
		httpOnly: true,
		expires: new Date(Date.now() + 5000),
	});

	res.status(200).json({
		status: 'success',
	});
};

// Kiểm tra đăng nhập chưa với token
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token)
		return next(
			new AppError(
				'You are not logged in! Please log in to get access',
				401,
			),
		);

	// Verification token
	const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check if user still exists || Kiểm tra người dùng tồn tại hay k
	const currentUser = await User.findById(decode.id);
	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exists',
				401,
			),
		);
	}

	// Kiểm tra người dùng thay đổi mật khẩu sau khi token được tạo
	// if (currentUser.changedPasswordAfter(decode.iat)) {
	// 	return next(
	// 		new AppError(
	// 			'User recently changed password! Please log in again',
	// 			401,
	// 		),
	// 	);
	// }
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

exports.restrictTo = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			return next(
				new AppError(
					'Bạn không có quyền truy cập vào đường dẫn này',
					400,
				),
			);
		}
		next();
	};
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	if (!(await user.correctPassword(req.body.passwordCurrent))) {
		return next(new AppError('Mật khẩu cũ không đúng', 401));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	createSendToken(user, 200, res);
});

exports.loginAdmin = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	// 1) Check Email Password nhập vào
	if (!email || !password)
		return next(new AppError('Please provide email or password', 400));

	// 2) Check Email Password đúng hay k
	const user = await User.findOne({ email }).select('+password');
	// console.log(user);
	if (!user || !(await user.correctPassword(password))) {
		return next(new AppError('Incorrect email or password', 400));
	}
	if (user.role !== 'admin') {
		return next(
			new AppError('Bạn không có quyền truy cập đường dẫn này', 400),
		);
	}

	const token = createToken(user._id);

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRES_IN * 60 * 24 * 60 * 1000,
		),
	});

	user.password = undefined;
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			// Verification token
			const decode = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET,
			);

			// Check if user still exists || Kiểm tra người dùng tồn tại hay k
			const currentUser = await User.findById(decode.id);
			if (!currentUser) {
				return next();
			}

			// Kiểm tra người dùng thay đổi mật khẩu sau khi token được tạo
			// if (currentUser.changedPasswordAfter(decode.iat)) {
			// 	return next();
			// }
			res.locals.user = currentUser;
			return next();
		}
	} catch (err) {
		return next();
	}
	next();
};
