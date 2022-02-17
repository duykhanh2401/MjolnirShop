const router = require('express').Router();
const viewController = require(`${__dirname}/../controllers/viewController`);

const authController = require(`${__dirname}/../controllers/authController`);

router.get(
	'/product/:id',
	authController.isLoggedIn,
	viewController.getProduct,
);
router.get('/cart', authController.isLoggedIn, viewController.getCart);
router.get(
	'/category/:category',
	authController.isLoggedIn,
	viewController.getCategory,
);
router.get(
	'/category/author/:author',
	authController.isLoggedIn,
	viewController.getAuthor,
);
router.get(
	'/category/:category/:id',
	authController.isLoggedIn,
	viewController.getProduct,
);
router.get('/checkout', authController.isLoggedIn, viewController.checkOut);
router.get('/search', authController.isLoggedIn, viewController.search);
router.get('/me', authController.isLoggedIn, viewController.getMe);
router.get('/', authController.isLoggedIn, viewController.getOverview);

module.exports = router;
