const express = require('express');
const morgan = require('morgan');
const AppError = require(`${__dirname}/utils/appError`);
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const app = express();

const userRoutes = require(`${__dirname}/routes/userRoutes`);
const productRoutes = require(`${__dirname}/routes/productRoutes`);
const categoryRoutes = require(`${__dirname}/routes/categoryRoutes`);
const cartRoutes = require(`${__dirname}/routes/cartRoutes`);
const viewRoutes = require(`${__dirname}/routes/viewRoutes`);
const adminRoutes = require(`${__dirname}/routes/adminRoutes`);

// 1. MIDDLEWARE
console.log(process.env.NODE_ENV);

// Set security HTTP headers
// app.use(
// 	helmet({
// 		contentSecurityPolicy: false,
// 	}),
// );
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'rate',
			'price',
			'ratingsQuantity',
			'ratingsAverage',
			'difficulty',
		],
	}),
);
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 1000,
	message:
		'Too many accounts created from this IP, please try again after 30m',
});

app.use('/api', limiter);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/admin', adminRoutes);
app.use('/', viewRoutes);

// 2. ROUTERS HANDLER

// 3. ROUTERS

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on server !!`, 400));
});

app.use(globalErrorHandler);
module.exports = app;
