const router = require('express').Router();
const orderController = require(`${__dirname}/../controllers/orderController`);

router
	.route('/')
	.get(orderController.getAllOrders)
	.post(orderController.createOrder);
router
	.route('/:id')
	.get(orderController.getOrder)
	.patch(orderController.updateOrder)
	.delete(orderController.deleteOrder);

module.exports = router;
