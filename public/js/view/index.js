import { getDataAPI, postDataAPI } from '../util/fetchAPI';
import { toast } from './../util/toastify';

$(document).ready(function () {
	document.querySelector('.btn-search').addEventListener('click', (e) => {
		$('.search').toggleClass('active');
	});

	const checkLogin = document.querySelector('#isLogin');

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
	}
});
