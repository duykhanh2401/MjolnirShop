const router = require('express').Router();
const orderController = require(`${__dirname}/../controllers/orderController`);
const Order = require('../models/orderModels');
router.get('/income', async (req, res) => {
	try {
		const orderReceived = await Order.aggregate([
			{
				$match: { status: 'Order Received' },
			},
			{
				$project: {
					sales: '$priceTotal',
					dateString: {
						$dateToString: {
							format: '%Y-%m-%d',
							date: '$createdAt',
						},
					},
				},
			},
			{
				$group: {
					_id: '$dateString',
					numberOrder: { $sum: 1 },
					total: { $sum: '$sales' },
					dateSort: { $first: '$dateString' },
				},
			},

			{
				$sort: { dateSort: 1 },
			},
		]);

		console.log(orderReceived);
		res.status(200).json(orderReceived);
	} catch (err) {
		res.status(500).json(err);
	}
});
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
