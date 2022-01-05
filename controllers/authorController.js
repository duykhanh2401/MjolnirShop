const Author = require(`${__dirname}/../models/authorModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);

// console.log(User);

exports.getAllAuthor = factory.getAll(Author);
exports.getAuthor = factory.getOne(Author, { path: 'products' });
exports.createAuthor = factory.createOne(Author);
exports.updateAuthor = factory.updateOne(Author);
exports.deleteAuthor = factory.deleteOne(Author);
