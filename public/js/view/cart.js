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

	if (products.length) {
		cartRender.forEach((el, index) => {
			let totalPrice = 0;
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
						<td class="w-25">
							<a href="/category/${product.category[0].slug}/${product.slug}">
							<img class="img-fluid img-thumbnail" src=${product.image} alt="Sheep" />
							</a>
							</td>
							<td>${product.name}</td>
							<td>${formatter.format(product.price)}</td>

							<td class="qty quantity-control">
							${
								cartRender.length === 1
									? `
							<span class="qty">${product.qty}</span>
							 `
									: index === 0
									? `<button data-id=${product.productID} class="dash-product"><i class="bi bi-dash-lg"></i></button>
									<span class="qty qty-cart-page">${product.qty}</span>
									<button data-id=${product.productID} class="plus-product">
									<i class="bi bi-plus-lg" ></i>
									</button> `
									: `
									<span class="qty">${product.qty}</span>
									 `
							}
							
							</td>
							<td data-id=${
								product.productID
							} class="remove-product"><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
						</tr>`;
					})
					.join('') +
				`</tbody>`;
			document.querySelectorAll('.total-price')[
				index
			].innerHTML = `Tạm Tính: <span class="text-success "> ${formatter.format(
				totalPrice,
			)} <span/>`;
		});

		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.remove('disabled'));

		if (cartRender.length === 2) {
			document.querySelectorAll('.dash-product').forEach((el) => {
				el.addEventListener('click', (e) => {
					const qty = $(
						`.dash-product[data-id=${e.currentTarget.dataset.id}] ~ .qty-cart-page`,
					)[0].innerHTML;
					console.log(qty);
					if (qty * 1 == 1) {
						removeProduct(e);
					} else {
						updateProduct(e.currentTarget.dataset.id, -1);
					}
				});
			});

			document.querySelectorAll('.plus-product').forEach((el) =>
				el.addEventListener('click', (e) => {
					updateProduct(e.currentTarget.dataset.id, 1);
				}),
			);
		}
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

const updateProduct = async (id, qty) => {
	try {
		const res = await postDataAPI('cart/addProduct', {
			product: id,
			quantity: qty,
		});
		if (res.status === 200) {
			toast('success', 'Đã cập nhật giỏ hàng');
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
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const addProductUser = async () => {
	try {
		const productID = document
			.querySelector('.product-single')
			.getAttribute('data-id');
		const qty = document.querySelector('.qty').innerText;

		const res = await postDataAPI('cart/addProduct', {
			product: productID,
			quantity: qty,
		});
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
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

export { renderCart, addProductUser };
