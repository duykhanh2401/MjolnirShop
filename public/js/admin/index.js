import { renderCategory } from './category';
import { renderAuthor } from './author';
import { renderProduct } from './product';
import { login } from './login';
import { getDataAPI } from '../util/fetchAPI';
import { renderUser } from './user';
import { renderOrder } from './order';
import { renderDashboard } from './dashboard';

$(document).ready(function () {
	// Phân loại các trang
	const category = document.querySelector('#category');
	const author = document.querySelector('#author');
	const product = document.querySelector('#product');
	const loginPage = document.querySelector('#loginPage');
	const mainPage = document.querySelector('#main');
	const user = document.querySelector('#user');
	const order = document.querySelector('#order');
	const dashboard = document.querySelector('#dashboard');

	//-----------------------------------------

	if (dashboard) {
		renderDashboard();
	}

	if (mainPage) {
		$('.logout')[0].addEventListener('click', async () => {
			const res = await getDataAPI('user/logoutAdmin');

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
		document.querySelector('.filter').addEventListener('change', () => {
			renderCategory();
		});
	}
	if (author) {
		renderAuthor();
		document.querySelector('.filter').addEventListener('change', () => {
			renderAuthor();
		});
	}

	if (user) {
		renderUser();
		document.querySelector('.filter').addEventListener('change', () => {
			renderUser();
		});
	}

	if (order) {
		renderOrder();
	}

	if (product) {
		$('.chosen-select').chosen({
			no_results_text: 'Không có thông tin trùng khớp',
		});
		renderProduct();
		document.querySelector('.filter').addEventListener('change', () => {
			renderProduct();
		});
	}

	if (loginPage) {
		login();
	}
});
