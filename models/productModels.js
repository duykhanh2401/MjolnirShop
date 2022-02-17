const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
// Name, Price, Description, Image Cover, Image, Category, Qty,
const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'Vui lòng nhập tên sản phẩm'],
			unique: true,
		},
		price: {
			type: Number,
			require: [true, 'Vui lòng nhập giá sản phẩm'],
		},
		description: {
			type: String,
			require: [true, 'Vui lòng nhập mô tả sản phẩm'],
		},
		image: String,
		category: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Category',
				require: [true, 'Vui lòng nhập danh mục sản phẩm'],
			},
		],
		author: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Author',
				require: [true, 'Vui lòng nhập tác giả'],
			},
		],
		ratingsAverage: {
			type: Number,
			default: 0,
			set: (val) => Math.round(val * 10) / 10,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		quantity: {
			type: Number,
			require: [true, 'Vui lòng nhập số lượng sản phẩm'],
			min: 0,
		},
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
		select: 'name slug',
	}).populate({
		path: 'author',
		select: 'name slug',
	});

	next();
});

productSchema.virtual('reviews', {
	ref: 'Review', // Model muốn tham chiếu
	foreignField: 'product', // Trường muốn tham chiếu
	localField: '_id', // Trường đối chiếu của Model hiện tại
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
