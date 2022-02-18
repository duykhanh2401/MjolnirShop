const router = require('express').Router();
const orderController = require(`${__dirname}/../controllers/orderController`);
const adminController = require(`${__dirname}/../controllers/adminController`);
const authController = require(`${__dirname}/../controllers/authController`);
router.get(
	'/income',
	adminController.protect,
	orderController.getDashboardData,
);
router
	.route('/')
	.get(adminController.protect, orderController.getAllOrders)
	.post(
		authController.protect,
		authController.restrictTo('user'),
		orderController.createOrder,
	);
router
	.route('/:id')
	.get(orderController.getOrder)
	.patch(adminController.protect, orderController.updateOrder)
	.delete(adminController.protect, orderController.deleteOrder);

module.exports = router;
