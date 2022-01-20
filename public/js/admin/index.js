import { renderCategory } from './category';
import { renderAuthor } from './author';
import { renderProduct } from './product';
import { login } from './login';
import { getDataAPI } from '../util/fetchAPI';
import { renderUser } from './user';
import { renderOrder } from './order';

$(document).ready(function () {
	// Phân loại các trang
	const category = document.querySelector('#category');
	const author = document.querySelector('#author');
	const product = document.querySelector('#product');
	const loginPage = document.querySelector('#loginPage');
	const mainPage = document.querySelector('#main');
	const user = document.querySelector('#user');
	const order = document.querySelector('#order');

	//-----------------------------------------

	if (mainPage) {
		$('.logout')[0].addEventListener('click', async () => {
			const res = await getDataAPI('user/logout');

			if (res.status === 200) {
				location.reload();
			}
		});
	}

	$('.menu-link').each((index, el) => {
		if (window.location.pathname === el.pathname) {
			el.parentElement.classList.add('active');
		}
	});

	if (category) {
		renderCategory();
	}
	if (author) {
		renderAuthor();
	}

	if (user) {
		renderUser();
	}

	if (order) {
		renderOrder();
	}

	if (product) {
		$('.chosen-select').chosen({
			no_results_text: 'Không có thông tin trùng khớp',
		});
		renderProduct();
	}

	if (loginPage) {
		login();
	}
});