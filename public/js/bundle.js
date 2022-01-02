/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./public/js/index.js ***!
  \****************************/
const createCategory = async (name) => {
	try {
		const res = await axios.post('http://localhost:8000/api/v1/category', {
			name,
		});
		if (res.data.status === 'success') {
			location.reload();
		}
		alert('thành công');
	} catch (error) {
		console.log('error');
	}
};

$(document).ready(function () {
	const categoryForm = $('.form--category')[0];

	$('.chosen-select').chosen({
		no_results_text: 'Oops, nothing found!',
	});

	const removeAllActive = () => {
		$('.menu-item').each((index, el) => {
			el.classList.remove('active');
		});
	};

	$('.menu-link').each((index, el) => {
		if (window.location.pathname === el.pathname) {
			el.parentElement.classList.add('active');
		}
	});

	if (categoryForm) {
		categoryForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = document.querySelector('#nameCategory').value;
			createCategory(name);
		});
	}
});

/******/ })()
;
//# sourceMappingURL=bundle.js.map