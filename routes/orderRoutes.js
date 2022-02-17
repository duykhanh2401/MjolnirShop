const router = require('express').Router();
const orderController = require(`${__dirname}/../controllers/orderController`);
const authController = require(`${__dirname}/../controllers/authController`);
router.get(
	'/income',
	authController.protect,
	authController.restrictTo('admin'),
	orderController.getDashboardData,
);
router
	.route('/')
	.get(
		authController.protect,
		authController.restrictTo('admin'),
		orderController.getAllOrders,
	)
	.post(
		authController.protect,
		authController.restrictTo('user'),
		orderController.createOrder,
	);
router
	.route('/:id')
	.get(orderController.getOrder)
	.patch(
		authController.protect,
		authController.restrictTo('admin'),
		orderController.updateOrder,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		orderController.deleteOrder,
	);

module.exports = router;
