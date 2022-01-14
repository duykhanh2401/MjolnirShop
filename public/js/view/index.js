import { getDataAPI, postDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';

$(document).ready(function () {
	document.querySelector('.btn-search').addEventListener('click', (e) => {
		$('.search').toggleClass('active');
	});

	const checkLogin = document.querySelector('#isLogin');

	// handle change quantity
	if (document.querySelector('.product-single')) {
		let quantity = document.querySelector('.qty').innerText;
		document
			.querySelector('i.bi.bi-dash-lg')
			.addEventListener('click', () => {
				if (quantity > 0) {
					document.querySelector('.qty').innerText = quantity * 1 - 1;
					quantity--;
				}
			});

		document
			.querySelector('i.bi.bi-plus-lg')
			.addEventListener('click', () => {
				document.querySelector('.qty').innerText = quantity * 1 + 1;
				quantity++;
			});
	}

	if (checkLogin) {
		document
			.querySelector('.logout-button')
			.addEventListener('click', async (e) => {
				const res = await getDataAPI('user/logout');

				if (res.status === 200) {
					location.reload();
				}
			});
	} else {
		// Enable form and set form
		const activeForm = (form) => {
			$('.form-user').removeClass('login-active register-active');
			$('.form-user').addClass(form);
		};

		document.querySelector('.login-span').addEventListener('click', (e) => {
			activeForm('login-active ');
		});

		document
			.querySelector('.register-span')
			.addEventListener('click', (e) => {
				activeForm('register-active ');
			});

		document
			.querySelector('.login-button')
			.addEventListener('click', (e) => {
				activeForm('login-active ');
			});

		document
			.querySelector('.register-button')
			.addEventListener('click', (e) => {
				activeForm('register-active ');
			});

		//------------------------------

		// Login
		document
			.querySelector('.form-login-user')
			.addEventListener('submit', async (e) => {
				e.preventDefault();
				const email = document.querySelector('.user-email-login').value;
				const password = document.querySelector(
					'.user-password-login',
				).value;

				try {
					const res = await postDataAPI('user/login', {
						email,
						password,
					});

					if (res.status === 200) {
						location.reload();
					}
				} catch (error) {
					toast('danger', error.response.data.message);
				}
			});

		//------------------------------

		const addProduct = () => {
			const productID = document
				.querySelector('.product-single')
				.getAttribute('data-id');
			const qty = document.querySelector('.qty').innerText;
			const name = document.querySelector(
				'.product-header span',
			).innerText;
			const image = document
				.querySelector('.image-product')
				.getAttribute('src');
			let products = [];
			if (localStorage.getItem('cart')) {
				let inCart = false;
				products = JSON.parse(localStorage.getItem('cart'));
				products.forEach((product) => {
					if (product.productID === productID) {
						inCart = true;
						product.qty = product.qty * 1 + qty * 1;
					}
				});
				if (inCart) {
					localStorage.setItem('cart', JSON.stringify(products));
				} else {
					products.push({ productID, qty, name, image });
					localStorage.setItem('cart', JSON.stringify(products));
				}
			} else {
				products.push({ productID, qty, name, image });
				localStorage.setItem('cart', JSON.stringify(products));
			}
		};

		document
			.querySelector('.product-add-to-cart')
			.addEventListener('click', addProduct('add'));

		//------------------------------

		// Render Cart
		const renderCart = () => {
			const cartRender = document.querySelector('.table-cart');
			if (localStorage.getItem('cart')) {
				const products = JSON.parse(localStorage.getItem('cart'));
				cartRender.innerHTML = products.map((product) => {
					return `
					<tr>
						<td class="w-25"><img class="img-fluid img-thumbnail" src=${product.image} alt="Sheep" /></td>
						<td>${product.name}</td>
						<td>100.000.đ</td>
						<td class="qty"><input class="form-control" id="input1" type="text" value=${product.qty} /></td>
						<td><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
					</tr>`;
				});
			}
		};
		renderCart();
	}
});
