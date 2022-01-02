const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
	{
		user: {
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

cartSchema.pre('findOne', function (next) {
	this.populate({
		path: 'products.product',
		select: 'name price image -category ',
	});
	next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
