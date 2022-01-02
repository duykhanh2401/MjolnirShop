const Category = require(`${__dirname}/../models/categoryModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);

// console.log(User);

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category, { path: 'products' });
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
