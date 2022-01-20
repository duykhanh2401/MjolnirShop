import { getDataAPI, postDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';
import { renderCart, addProductAnonymous, addProductUser } from './cart';
import { checkout } from './checkout';
$(document).ready(async () => {
	const checkLogin = document.querySelector('#isLogin');
	const checkCheckout = document.querySelector('#checkout');
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

		document
			.querySelector('.btn-add-review')
			.addEventListener('click', async () => {
				const name = document.querySelector('#nameReview').value;
				const email = document.querySelector('#emailReview').value;
				const rating = document.querySelector('#ratingReview').value;
				const review = document.querySelector('#content').value;
				const product = document
					.querySelector('.product-single')
					.getAttribute('data-id');

				const res = await postDataAPI('review', {
					name,
					email,
					rating,
					review,
					product,
				});
				console.log(res);
			});
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

		renderCart(productsRender, true);
	} else {
		// Render Cart
		if (!checkCheckout) {
			const products = JSON.parse(localStorage.getItem('cart'));
			renderCart(products);

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
