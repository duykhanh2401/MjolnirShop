import { renderCategory } from './category';
import { renderAuthor } from './author';
import { renderProduct } from './product';
import { login } from './login';

$(document).ready(function () {
	// Phân loại các trang
	const category = document.querySelector('#category');
	const author = document.querySelector('#author');
	const product = document.querySelector('#product');
	const loginPage = document.querySelector('#loginPage');
	//-----------------------------------------

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
