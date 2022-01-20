import { postDataAPI, deleteDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const removeProduct = async (e, isUser) => {
	if (isUser) {
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
	} else {
		const products = JSON.parse(localStorage.getItem('cart'));

		const newProducts = products.filter((product) => {
			return product.productID !== e.currentTarget.dataset.id;
		});
		toast('success', 'Đã xoá 1 sản phẩm');

		localStorage.setItem('cart', JSON.stringify(newProducts));
		(() => renderCart(newProducts))();
	}
};

const renderCart = (products, isUser) => {
	const cartRender = document.querySelectorAll('.table.table-cart');
	let totalPrice = 0;
	console.log(products);

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
		el.addEventListener('click', (e) => removeProduct(e, isUser));
	});
};

const addProductAnonymous = () => {
	const productID = document
		.querySelector('.product-single')
		.getAttribute('data-id');
	const qty = document.querySelector('.qty').innerText;
	const name = document.querySelector('.product-header span').innerText;
	const price = document
		.querySelector('.product-single-price')
		.innerText.replace(/\D/g, '');
	const image = document.querySelector('.image-product').getAttribute('src');
	let products = [];
	products = JSON.parse(localStorage.getItem('cart'));
	if (products.length) {
		let inCart = false;
		products.forEach((product) => {
			if (product.productID === productID) {
				inCart = true;
				product.qty = product.qty * 1 + qty * 1;
			}
		});
		if (inCart) {
			localStorage.setItem('cart', JSON.stringify(products));
			renderCart(products);
			toast('success', 'Thêm sản phẩm thành công');
		} else {
			products.push({ productID, qty, name, image, price });
			localStorage.setItem('cart', JSON.stringify(products));
			renderCart(products);
			toast('success', 'Thêm sản phẩm thành công');
		}
	} else {
		products.push({ productID, qty, name, image, price });
		localStorage.setItem('cart', JSON.stringify(products));
		renderCart(products);
		toast('success', 'Thêm sản phẩm thành công');
	}
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

export { renderCart, addProductAnonymous, addProductUser };
