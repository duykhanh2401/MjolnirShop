const Order = require(`${__dirname}/../models/orderModels`);
const Product = require(`${__dirname}/../models/productModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);
const { sendMail } = require(`${__dirname}/../utils/mail`);
const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});
exports.createOrder = catchAsync(async (req, res, next) => {
	const products = await Product.find();
	const listUpdate = [];
	let priceTotal = 30000;
	for (let product of products) {
		for (let el of req.body.products) {
			if (product.id === el.product) {
				if (product.quantity < el.quantity) {
					console.log(product);
					return next(
						new AppError('Sản phẩm quá giới hạn cho phép', 400),
					);
				}
			}
		}
	}

	products.forEach((product) => {
		req.body.products.forEach((el) => {
			if (product.id === el.product) {
				priceTotal = priceTotal + product.price * el.quantity;
				product.quantity = product.quantity - el.quantity;
				listUpdate.push({
					id: product.id,
					quantity: product.quantity,
					product,
				});
			}
		});
	});
	await Order.create({ ...req.body, priceTotal });

	if (listUpdate.length) {
		listUpdate.forEach(async (el) => {
			await Product.findByIdAndUpdate(el.id, { quantity: el.quantity });
		});
	}

	let totalPrice = 0;
	let HTMLSend = `
    <div class="modal-header">
        <h1 class="modal-title" id="exampleModalLabel">Thông tin đơn hàng</h1>
    </div>
    <div class="modal-body">
        <div class="information-order">
            <div class="name-order">Tên người đặt hàng: <span>${
				req.body.name
			}</span></div>
            <div class="email-order">Email đặt hàng: <span>${
				req.body.email
			}</span></div>
            <div class="address-order">Địa chỉ đặt hàng: <span>${
				req.body.address
			}</span></div>
            <div class="phone-number-order">Số điện thoại đặt hàng: <span>${
				req.body.phone
			}</span></div>
            <div class="cart-order">Thông tin giỏ hàng: </div>
        </div>
    <table class="product-table" style="text-align:center">
        <thead>
            <th></th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
        </thead>
        <tbody class="body-info">
        ${listUpdate
			.map((product) => {
				totalPrice += product.product.price * product.quantity;
				return `
                            <tr>
                                <td class="w-25"><img class="img-fluid img-thumbnail" style="width:100px" src=${
									product.product.image
								} alt="Sheep" /></td>
                                <td>${product.product.name}</td>
                                <td class="qty">${product.quantity} </td>
                                <td>${formatter.format(
									product.product.price,
								)}</td>
                        </tr>`;
			})
			.join('')}
        </tbody>
    </table>
    <div class="order-total">
        <div class="order-total-name">Tổng cộng</div>
        <div class="order-total-price">${formatter.format(totalPrice)}</div>
    </div>
</div>
    `;

	sendMail(req.body.email, 'Đặt hàng thành công', HTMLSend);
	sendMail(process.env.ADMIN_EMAIL, 'Đặt hàng thành công', HTMLSend);

	res.status(200).json({
		status: 'success',
	});
});
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
