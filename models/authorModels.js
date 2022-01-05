const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const authorSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Nhập tên danh mục'],
			unique: true,
		},

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
authorSchema.virtual('products', {
	ref: 'Author',
	foreignField: 'author',
	localField: '_id',
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
