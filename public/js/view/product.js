import { renderCart, addProductUser } from './cart';

const renderProduct = async () => {
	let quantity = document.querySelector('.qty').innerText;
	document.querySelector('i.bi.bi-dash-lg').addEventListener('click', () => {
		if (quantity > 0) {
			document.querySelector('.qty').innerText = quantity * 1 - 1;
			quantity--;
		}
	});

	document.querySelector('i.bi.bi-plus-lg').addEventListener('click', () => {
		const max = document.querySelector('.max-quantity').innerText * 1;
		if (quantity < max) {
			document.querySelector('.qty').innerText = quantity * 1 + 1;
			quantity++;
		}
	});

	if (document.querySelector('.product-add-to-cart')) {
		document
			.querySelector('.product-add-to-cart')
			.addEventListener('click', () => addProductUser());
	}

	const res = await getDataAPI('cart');
	const productsRender = res.data.data.map((productItem) => {
		const { product } = productItem;
		product.qty = productItem.quantity;
		product.productID = product._id;
		return product;
	});

	renderCart(productsRender);

	document
		.querySelector('.product-order')
		.addEventListener('click', async () => {
			await addProductUser();
		});
};

export { renderProduct };
