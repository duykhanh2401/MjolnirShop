import {
	createCategory,
	deleteCategory,
	updateCategory,
	renderCategory,
} from './category';

$(document).ready(function () {
	// Phân loại các trang
	const category = $('#category');

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
		// Add new category

		// ------------------------------
	}
});
