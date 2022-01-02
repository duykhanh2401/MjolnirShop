const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên danh mục'],
			unique: true,
		},

		// products: [
		// 	{
		// 		type: mongoose.Schema.ObjectId,
		// 	},
		// ],
		slug: { type: String, slug: 'name', unique: true },
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual populate
categorySchema.virtual('products', {
	ref: 'Product',
	foreignField: 'category',
	localField: '_id',
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
