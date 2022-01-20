const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Name, Email, Password , PasswordConfirm, IMG, PhoneNumber, Address, Role.
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'Vui lòng nhập tên của bạn'],
		},
		email: {
			type: String,
			required: [true, 'Vui lòng nhập email của bạn'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Đây không phải là email'],
		},
		password: {
			type: String,
			require: [true, 'Vui lòng nhập mật khẩu'],
			minLength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Vui lòng nhập lại mật khẩu'],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				messages: 'Vui lòng nhập mật khẩu giống nhau',
			},
		},

		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{ toJson: { virtual: true }, toObject: { virtual: true } },
);

// Mã hoá mật khẩu
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
});

// Cập nhật giờ thay đổi mật khẩu
userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangeAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, async function (next) {
	this.find({ active: { $ne: false } });
	next();
});

//Check Password
userSchema.methods.correctPassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
