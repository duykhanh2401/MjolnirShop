const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Name, Price, Description, Image Cover, Image, Category, Qty,
const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'Vui lòng nhập tên sản phẩm'],
		},
		price: {
			type: Number,
			require: [true, 'Vui lòng nhập giá sản phẩm'],
		},
		description: {
			type: String,
			require: [true, 'Vui lòng nhập mô tả sản phẩm'],
		},
		image: [String],
		category: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Category',
				require: [true, 'Vui lòng nhập danh mục sản phẩm'],
			},
		],

		createdAt: {
			type: Date,
			default: Date.now,
		},
		qty: {
			type: Number,
			require: [true, 'Vui lòng nhập số lượng sản phẩm'],
			min: 0,
		},
		author: String,
		slug: { type: String, slug: 'name', unique: true },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

productSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'category',
		select: 'name',
	});

	next();
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
