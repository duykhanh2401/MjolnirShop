import { renderCategory } from './category';
import { renderAuthor } from './author';

$(document).ready(function () {
	// Phân loại các trang
	const category = document.querySelector('#category');
	const author = document.querySelector('#author');
	//-----------------------------------------
	$('.chosen-select').chosen({
		no_results_text: 'Oops, nothing found!',
	});

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
});
