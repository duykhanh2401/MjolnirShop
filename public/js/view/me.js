import { getDataAPI, postDataAPI } from './../util/fetchAPI';
import { toast } from './../util/toastify';
const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});
const renderMe = () => {
	const activeForm = (form) => {
		$('.form-user').removeClass('login-active register-active');
		$('.form-user').addClass(form);
	};

	document.querySelector('.login-span').addEventListener('click', (e) => {
		activeForm('login-active');
	});

	document.querySelector('.register-span').addEventListener('click', (e) => {
		activeForm('register-active ');
	});

	document.querySelectorAll('.login-button').forEach((el) =>
		el.addEventListener('click', (e) => {
			activeForm('login-active ');
		}),
	);

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

		try {
			const res = await getDataAPI(`order/${itemId}`);
			const infoRender = document.querySelector('.body-info');
			let totalPrice = 0;
			const { products } = res.data.data;

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
			toast('danger', error.response.data.message);
		}
	});

	$('#addNewModal').on('shown.bs.modal', async function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		try {
			const res = await getDataAPI(`order/${itemId}`);
			const productReview = document.querySelector('#productReview');
			const { products } = res.data.data;
			productReview.innerHTML = products
				.map((product) => {
					return `<option value="${product.product.id}">${product.product.name}</option>5</option>`;
				})
				.join('');

			document
				.querySelector('.btn-add-review')
				.addEventListener('click', async () => {
					try {
						const rating =
							document.querySelector('#ratingReview').value;
						const review = document.querySelector('#content').value;
						const productReview =
							document.querySelector('#productReview').value;

						const res = await postDataAPI('review', {
							rating,
							review,
							idProduct: productReview,
						});

						if (res.status === 200) {
							toast('success', 'Đánh giá thành công');
							setTimeout(() => {
								location.reload();
							}, 3000);
						}
					} catch (e) {
						toast('danger', e.message);
					}
				});
		} catch (error) {
			toast('danger', error.response.data.message);
		}
	});

	document
		.querySelector('.button-update-name')
		.addEventListener('click', async () => {
			const name = document.querySelector('.user-name-update').value;
			const res = await postDataAPI('user/updateMe', { name });
			if (res.status === 200) {
				location.reload();
			}
		});

	document
		.querySelector('.button-password-update')
		.addEventListener('click', async () => {
			const passwordCurrent =
				document.querySelector('.password-current').value;
			const password = document.querySelector('.password-new').value;
			const passwordConfirm =
				document.querySelector('.password-confirm').value;
			const res = await postDataAPI('user/updateMyPassword', {
				passwordCurrent,
				password,
				passwordConfirm,
			});
			if (res.status === 200) {
				location.reload();
			}
		});
};

export { renderMe };
