/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/util/fetchAPI.js":
/*!************************************!*\
  !*** ./public/js/util/fetchAPI.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDataAPI": () => (/* binding */ getDataAPI),
/* harmony export */   "postDataAPI": () => (/* binding */ postDataAPI),
/* harmony export */   "patchDataAPI": () => (/* binding */ patchDataAPI),
/* harmony export */   "putDataAPI": () => (/* binding */ putDataAPI),
/* harmony export */   "deleteDataAPI": () => (/* binding */ deleteDataAPI)
/* harmony export */ });
const getDataAPI = async (url) => {
	const res = await axios.get(`http://localhost:8000/api/v1/${url}`);
	return res;
};

const postDataAPI = async (url, data) => {
	const res = await axios.post(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

const patchDataAPI = async (url, data) => {
	const res = await axios.patch(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

const putDataAPI = async (url, data) => {
	const res = await axios.put(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

const deleteDataAPI = async (url, data) => {
	const res = await axios.delete(`http://localhost:8000/api/v1/${url}`);
	return res;
};


/***/ }),

/***/ "./public/js/util/toastify.js":
/*!************************************!*\
  !*** ./public/js/util/toastify.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toast": () => (/* binding */ toast)
/* harmony export */ });
const toast = (status, message) => {
	// data
	var clear;
	var msgDuration = 3000;
	var $msg = $('.msg');
	function timer() {
		clearTimeout(clear);
		clear = setTimeout(function () {
			hide();
		}, msgDuration);
	}

	function hide() {
		$msg.removeClass('msg-success msg-danger msg-warning msg-info active');
	}
	// 2 seconds
	hide();

	// cache DOM

	// render message

	switch (status) {
		case 'success':
			$msg.addClass('msg-success active').text(message);
			break;
		case 'danger':
			$msg.addClass('msg-danger active').text(message);
			break;
		case 'warning':
			$msg.addClass('msg-warning active').text(message);
			break;
		case 'info':
			$msg.addClass('msg-info active').text(message);
			break;
	}

	// bind events

	$msg.on('transitionend', timer);
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./public/js/view/index.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../util/toastify */ "./public/js/util/toastify.js");



$(document).ready(function () {
	document.querySelector('.btn-search').addEventListener('click', (e) => {
		$('.search').toggleClass('active');
	});

	const checkLogin = document.querySelector('#isLogin');

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

	if (checkLogin) {
		document
			.querySelector('.logout-button')
			.addEventListener('click', async (e) => {
				const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('user/logout');

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

		// Login
		document
			.querySelector('.form-login-user')
			.addEventListener('submit', async (e) => {
				e.preventDefault();
				const email = document.querySelector('.user-email-login').value;
				const password = document.querySelector(
					'.user-password-login',
				).value;

				try {
					const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('user/login', {
						email,
						password,
					});

					if (res.status === 200) {
						location.reload();
					}
				} catch (error) {
					(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
				}
			});

		//------------------------------

		const addProduct = () => {
			const productID = document
				.querySelector('.product-single')
				.getAttribute('data-id');
			const qty = document.querySelector('.qty').innerText;
			const name = document.querySelector(
				'.product-header span',
			).innerText;
			const image = document
				.querySelector('.image-product')
				.getAttribute('src');
			let products = [];
			if (localStorage.getItem('cart')) {
				let inCart = false;
				products = JSON.parse(localStorage.getItem('cart'));
				products.forEach((product) => {
					if (product.productID === productID) {
						inCart = true;
						product.qty = product.qty * 1 + qty * 1;
					}
				});
				if (inCart) {
					localStorage.setItem('cart', JSON.stringify(products));
				} else {
					products.push({ productID, qty, name, image });
					localStorage.setItem('cart', JSON.stringify(products));
				}
			} else {
				products.push({ productID, qty, name, image });
				localStorage.setItem('cart', JSON.stringify(products));
			}
		};

		document
			.querySelector('.product-add-to-cart')
			.addEventListener('click', addProduct('add'));

		//------------------------------

		// Render Cart
		const renderCart = () => {
			const cartRender = document.querySelector('.table-cart');
			if (localStorage.getItem('cart')) {
				const products = JSON.parse(localStorage.getItem('cart'));
				cartRender.innerHTML = products.map((product) => {
					return `
					<tr>
						<td class="w-25"><img class="img-fluid img-thumbnail" src=${product.image} alt="Sheep" /></td>
						<td>${product.name}</td>
						<td>100.000.đ</td>
						<td class="qty"><input class="form-control" id="input1" type="text" value=${product.qty} /></td>
						<td><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
					</tr>`;
				});
			}
		};
		renderCart();
	}
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map