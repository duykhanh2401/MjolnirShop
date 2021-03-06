import { getDataAPI, postDataAPI, deleteDataAPI } from './../util/fetchAPI';
import { toast } from './../util/toastify';

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const renderData = (products) => {
	const cartRender = document.querySelectorAll('tbody');
	let totalPrice = 0;
	if (products.length) {
		cartRender.forEach((el) => {
			el.innerHTML = products
				.map((product) => {
					totalPrice += product.price * product.qty;
					return `
						<tr>
							<td class="w-25"><img class="img-fluid img-thumbnail" src=${
								product.image
							} alt="Sheep" /></td>
							<td>${product.name}</td>
							<td class="qty">${product.qty} </td>
							<td>${formatter.format(product.price)}</td>
					</tr>`;
				})
				.join('');
		});

		document.querySelector('.subtotal-price').innerHTML = `${formatter.format(
			totalPrice,
		)}`;

		document.querySelector(
			'.order-total-price ',
		).innerHTML = `${formatter.format(totalPrice + 30000)}`;
	}
};

const checkout = async () => {
	const cartData = await getDataAPI('cart');
	const productsRender = cartData.data.data.map((productItem) => {
		const { product } = productItem;
		product.qty = productItem.quantity;
		product.productID = product._id;
		return product;
	});

	renderData(productsRender);
	const productSubmit = productsRender.map((el) => {
		return {
			product: el.productID,
			quantity: el.qty * 1,
		};
	});
	document
		.querySelector('.success-oder')
		.addEventListener('click', async () => {
			try {
				const name = document.querySelector('#nameUser').value;
				const email = document.querySelector('#emailUser').value;
				const phone = document.querySelector('#phoneNumberUser').value;
				const address = document.querySelector('#addressUser').value;
				const idUser = document.querySelector('#emailUser').dataset.idUser;
				if (phone.length != 10) {
					return toast('danger', 'Vui lòng nhập đúng số điện thoại');
				}
				const res = await postDataAPI('order', {
					name,
					email,
					phone,
					address,
					products: productSubmit,
					idUser,
				});

				if (res.status === 200) {
					document.querySelector(
						'.container',
					).innerHTML = `<div class="success-checkout">
							Bạn đã đặt hàng thành công. <a href="/">Quay về trang chủ</a>
							</div>`;

					await deleteDataAPI('cart/removeAllProducts');
				}
			} catch (error) {
				console.log(error);
				toast('danger', error.response);
			}
		});
};

export { checkout };
