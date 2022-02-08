import { getDataAPI, postDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';
import { renderCart, addProductUser } from './cart';
import { checkout } from './checkout';
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
				document.querySelector('.qty').innerText = quantity * 1 + 1;
				quantity++;
			});
	}

	if (checkMePage) {
		let tabContent = document.querySelectorAll('.container__inner');
		let tabItem = document.querySelectorAll('.container__item');

		// For each element with class 'container__item'
		for (let i = 0; i < tabItem.length; i++) {
			// if the element was hovered
			//you can replace mouseover with click
			tabItem[i].addEventListener('click', () => {
				// Add to all containers class 'container__inner_hidden'
				tabContent.forEach((item) => {
					item.classList.add('container__inner_hidden');
				});
				// Clean all links from class 'container__item_active'
				tabItem.forEach((item) => {
					item.classList.remove('container__item_active');
				});
				// Make visible correct tab content and add class to item
				tabContent[i].classList.remove('container__inner_hidden');
				tabItem[i].classList.add('container__item_active');
			});
		}

		$('#showInfoModal').on('shown.bs.modal', async function (e) {
			const item = $(e.relatedTarget).closest('.item-list');
			const itemId = item.attr('data-id');
			console.log(itemId);

			try {
				const res = await getDataAPI(`order/${itemId}`);
				const infoRender = document.querySelector('.body-info');
				let totalPrice = 0;
				const { products } = res.data.data;
				console.log(res);

				infoRender.innerHTML = products
					.map((product) => {
						totalPrice += product.product.price * product.quantity;
						return `
									<tr>
										<td class="w-25"><img class="img-fluid img-thumbnail" style="width:100px" src=${
											product.product.image
										} alt="Sheep" /></td>
										<td>${product.product.name}</td>
										<td class="qty">${product.quantity} </td>
										<td>${formatter.format(product.product.price)}</td>
								</tr>`;
					})
					.join('');

				document.querySelector(
					'.order-total-price ',
				).innerHTML = `${formatter.format(totalPrice + 30000)}`;

				document.querySelector('.name-order span').innerHTML =
					res.data.data.name;

				document.querySelector('.email-order span').innerHTML =
					res.data.data.email;

				document.querySelector('.address-order span').innerHTML =
					res.data.data.address;

				document.querySelector('.phone-number-order span').innerHTML =
					res.data.data.phone;
			} catch (error) {
				console.log(error);
			}
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
