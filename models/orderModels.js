const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên người nhận hàng'],
		},
		email: {
			type: String,
			required: [true, 'Vui lòng nhập email của bạn'],
			lowercase: true,
			validate: [validator.isEmail, 'Đây không phải là email'],
		},
		address: {
			type: String,
			required: [true, 'Nhập địa chỉ của bạn'],
		},
		phone: {
			type: Number,
			required: [true, 'Nhập số điện thoại của bạn'],
		},
		idUser: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
		products: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: 'Product',
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
		status: {
			type: String,
			enum: [
				'Order Placed',
				'Order Confirmed',
				'Shipped Out',
				'Order Received',
				'Cancel The Order',
			],
			default: 'Order Placed',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

orderSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'products.product',
		select: 'name price image -category ',
	});
	next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
