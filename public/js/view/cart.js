import { postDataAPI, deleteDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const removeProduct = async (e) => {
	const res = await postDataAPI('cart/removeProduct', {
		product: e.currentTarget.dataset.id,
	});

	if (res.status === 200) {
		toast('success', 'Đã xoá 1 sản phẩm');
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});
		(() => renderCart(productsRender, true))();
	} else {
		toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

const renderCart = (products) => {
	const cartRender = document.querySelectorAll('.table.table-cart');
	let totalPrice = 0;

	if (products.length) {
		cartRender.forEach((el) => {
			el.innerHTML =
				`<thead>
			<tr>
				<th scope="col"></th>
				<th scope="col">Tên Sản Phẩm</th>
				<th scope="col">Giá</th>
				<th scope="col">Số Lượng</th>
				<th scope="col"> </th>
			</tr>
		</thead>
		<tbody >` +
				products
					.map((product) => {
						totalPrice += product.price * product.qty;
						return `
						<tr>
							<td class="w-25"><img class="img-fluid img-thumbnail" src=${
								product.image
							} alt="Sheep" /></td>
							<td>${product.name}</td>
							<td>${formatter.format(product.price)}</td>
							<td class="qty">${product.qty} </td>
							<td data-id=${
								product.productID
							} class="remove-product"><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
						</tr>`;
					})
					.join('') +
				`</tbody>`;
		});

		document
			.querySelectorAll('.total-price')
			.forEach(
				(el) =>
					(el.innerHTML = `Tạm Tính: <span class="text-success "> ${formatter.format(
						totalPrice,
					)} <span/>`),
			);

		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.remove('disabled'));
	} else {
		document
			.querySelectorAll('.table.table-cart')
			.forEach(
				(el) =>
					(el.innerHTML =
						'<span class="empty-cart">Giỏ hàng trống</span>'),
			);
		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.add('disabled'));

		document
			.querySelectorAll('.total-price')
			.forEach((el) => (el.innerHTML = ``));
	}

	document.querySelectorAll('.remove-product').forEach((el) => {
		el.addEventListener('click', (e) => removeProduct(e));
	});
};
const addProductUser = async () => {
	const productID = document
		.querySelector('.product-single')
		.getAttribute('data-id');
	const qty = document.querySelector('.qty').innerText;

	const res = await postDataAPI('cart/addProduct', {
		product: productID,
		quantity: qty,
	});
	console.log(res);
	if (res.status === 200) {
		toast('success', 'Thêm sản phẩm thành công');
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});
		(() => renderCart(productsRender, true))();
	} else {
		toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

export { renderCart, addProductUser };
