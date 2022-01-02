const User = require(`${__dirname}/../models/userModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);

// console.log(User);

const filterObject = (obj, ...fields) => {
	const objectResult = {};

	Object.keys(obj).forEach((el) => {
		if (fields.includes(el)) objectResult[el] = obj[el];
	});

	return objectResult;
};

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError(
				'Cập nhật mật khẩu vui lòng sử dụng /updatePassword',
				400,
			),
		);

	const filterBody = filterObject(req.body, 'name', 'phoneNumber', 'address');

	const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: updateUser,
	});
});

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
	});
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
