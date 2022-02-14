import { getDataAPI, postDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';
import { renderCart, addProductUser } from './cart';
import { checkout } from './checkout';
import { renderMe } from './me';
const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

$(document).ready(async () => {
	const checkLogin = document.querySelector('#isLogin');
	const checkCheckout = document.querySelector('#checkout');
	const checkMePage = document.querySelector('#me');
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
				const max =
					document.querySelector('.max-quantity').innerText * 1;
				if (quantity < max) {
					document.querySelector('.qty').innerText = quantity * 1 + 1;
					quantity++;
				}
			});
	}

	if (checkMePage) {
		renderMe();
	}

	if (checkCheckout) {
		checkout();
	} else {
		document.querySelector('.btn-search').addEventListener('click', (e) => {
			$('.search').toggleClass('active');
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
	} else {
		// Render Cart
		if (!checkCheckout) {
			//------------------------------
			if (document.querySelector('.product-add-to-cart')) {
				document
					.querySelector('.product-add-to-cart')
					.addEventListener('click', () => addProductAnonymous());
			}

			//------------------------------
			// Enable form and set form
			const activeForm = (form) => {
				$('.form-user').removeClass('login-active register-active');
				$('.form-user').addClass(form);
			};

			document
				.querySelector('.login-span')
				.addEventListener('click', (e) => {
					activeForm('login-active ');
				});

			document
				.querySelector('.register-span')
				.addEventListener('click', (e) => {
					activeForm('register-active ');
				});

			document.querySelectorAll('.login-button').forEach((el) =>
				el.addEventListener('click', (e) => {
					activeForm('login-active ');
				}),
			);

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
					const email =
						document.querySelector('.user-email-login').value;
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

			// Register
			document
				.querySelector('.form-register-user')
				.addEventListener('submit', async (e) => {
					e.preventDefault();
					const email = document.querySelector(
						'.user-email-register',
					).value;
					const password = document.querySelector(
						'.user-password-register',
					).value;
					const name = document.querySelector(
						'.user-name-register',
					).value;
					const passwordConfirm = document.querySelector(
						'.user-password-confirm-register',
					).value;

					try {
						const res = await postDataAPI('user/register', {
							email,
							password,
							name,
							passwordConfirm,
						});

						if (res.status === 200) {
							location.reload();
						}
					} catch (error) {
						toast('danger', error.response.data.message);
					}
				});
		}
	}
	//------------------------------
});
