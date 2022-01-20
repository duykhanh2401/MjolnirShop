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
	const res = await axios.get(`/api/v1/${url}`);
	return res;
};

const postDataAPI = async (url, data) => {
	const res = await axios.post(`/api/v1/${url}`, data);
	return res;
};

const patchDataAPI = async (url, data) => {
	const res = await axios.patch(`/api/v1/${url}`, data);
	return res;
};

const putDataAPI = async (url, data) => {
	const res = await axios.put(`/api/v1/${url}`, data);
	return res;
};

const deleteDataAPI = async (url, data) => {
	const res = await axios.delete(`/api/v1/${url}`, data);
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


/***/ }),

/***/ "./public/js/view/cart.js":
/*!********************************!*\
  !*** ./public/js/view/cart.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderCart": () => (/* binding */ renderCart),
/* harmony export */   "addProductAnonymous": () => (/* binding */ addProductAnonymous),
/* harmony export */   "addProductUser": () => (/* binding */ addProductUser)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../util/toastify */ "./public/js/util/toastify.js");



const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const removeProduct = async (e, isUser) => {
	if (isUser) {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('cart/removeProduct', {
			product: e.currentTarget.dataset.id,
		});

		if (res.status === 200) {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Đã xoá 1 sản phẩm');
			const productsRender = res.data.data.map((productItem) => {
				const { product } = productItem;
				product.qty = productItem.quantity;
				product.productID = product._id;
				return product;
			});
			(() => renderCart(productsRender, true))();
		} else {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
		}
	} else {
		const products = JSON.parse(localStorage.getItem('cart'));

		const newProducts = products.filter((product) => {
			return product.productID !== e.currentTarget.dataset.id;
		});
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Đã xoá 1 sản phẩm');

		localStorage.setItem('cart', JSON.stringify(newProducts));
		(() => renderCart(newProducts))();
	}
};

const renderCart = (products, isUser) => {
	const cartRender = document.querySelectorAll('.table.table-cart');
	let totalPrice = 0;

	if (products.length) {
		cartRender.forEach((el) => {
			el.innerHTML =
				`<thead>
			<tr>
				<th scope="col"></th>
				<th scope="col">Tên Sản Phẩm</th>
				<th scope="col">Giá</th>
				<th scope="col">Số Lượng</th>
				<th scope="col"> </th>
			</tr>
		</thead>
		<tbody >` +
				products
					.map((product) => {
						totalPrice += product.price * product.qty;
						return `
						<tr>
							<td class="w-25"><img class="img-fluid img-thumbnail" src=${
								product.image
							} alt="Sheep" /></td>
							<td>${product.name}</td>
							<td>${formatter.format(product.price)}</td>
							<td class="qty">${product.qty} </td>
							<td data-id=${
								product.productID
							} class="remove-product"><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
						</tr>`;
					})
					.join('') +
				`</tbody>`;
		});

		document
			.querySelectorAll('.total-price')
			.forEach(
				(el) =>
					(el.innerHTML = `Tạm Tính: <span class="text-success "> ${formatter.format(
						totalPrice,
					)} <span/>`),
			);

		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.remove('disabled'));
	} else {
		document
			.querySelectorAll('.table.table-cart')
			.forEach(
				(el) =>
					(el.innerHTML =
						'<span class="empty-cart">Giỏ hàng trống</span>'),
			);
		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.add('disabled'));

		document
			.querySelectorAll('.total-price')
			.forEach((el) => (el.innerHTML = ``));
	}

	document.querySelectorAll('.remove-product').forEach((el) => {
		el.addEventListener('click', (e) => removeProduct(e, isUser));
	});
};

const addProductAnonymous = () => {
	const productID = document
		.querySelector('.product-single')
		.getAttribute('data-id');
	const qty = document.querySelector('.qty').innerText;
	const name = document.querySelector('.product-header span').innerText;
	const price = document
		.querySelector('.product-single-price')
		.innerText.replace(/\D/g, '');
	const image = document.querySelector('.image-product').getAttribute('src');
	let products = [];
	products = JSON.parse(localStorage.getItem('cart'));
	if (products.length) {
		let inCart = false;
		products.forEach((product) => {
			if (product.productID === productID) {
				inCart = true;
				product.qty = product.qty * 1 + qty * 1;
			}
		});
		if (inCart) {
			localStorage.setItem('cart', JSON.stringify(products));
			renderCart(products);
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Thêm sản phẩm thành công');
		} else {
			products.push({ productID, qty, name, image, price });
			localStorage.setItem('cart', JSON.stringify(products));
			renderCart(products);
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Thêm sản phẩm thành công');
		}
	} else {
		products.push({ productID, qty, name, image, price });
		localStorage.setItem('cart', JSON.stringify(products));
		renderCart(products);
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Thêm sản phẩm thành công');
	}
};

const addProductUser = async () => {
	const productID = document
		.querySelector('.product-single')
		.getAttribute('data-id');
	const qty = document.querySelector('.qty').innerText;

	const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('cart/addProduct', {
		product: productID,
		quantity: qty,
	});
	console.log(res);
	if (res.status === 200) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Thêm sản phẩm thành công');
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});
		(() => renderCart(productsRender, true))();
	} else {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};




/***/ }),

/***/ "./public/js/view/checkout.js":
/*!************************************!*\
  !*** ./public/js/view/checkout.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkout": () => (/* binding */ checkout)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../util/toastify */ "./public/js/util/toastify.js");



const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const renderData = (products) => {
	const cartRender = document.querySelectorAll('tbody');
	let totalPrice = 0;
	if (products.length) {
		cartRender.forEach((el) => {
			el.innerHTML = products
				.map((product) => {
					totalPrice += product.price * product.qty;
					return `
						<tr>
							<td class="w-25"><img class="img-fluid img-thumbnail" src=${
								product.image
							} alt="Sheep" /></td>
							<td>${product.name}</td>
							<td class="qty">${product.qty} </td>
							<td>${formatter.format(product.price)}</td>
					</tr>`;
				})
				.join('');
		});

		document.querySelector(
			'.subtotal-price',
		).innerHTML = `${formatter.format(totalPrice)}`;

		document.querySelector(
			'.order-total-price ',
		).innerHTML = `${formatter.format(totalPrice + 30000)}`;
	}
};

const checkout = async () => {
	const checkLogin = document.querySelector('.isLogin');

	if (checkLogin) {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('cart');
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});

		renderData(productsRender);
		const productSubmit = productsRender.map((el) => {
			return {
				product: el.productID,
				quantity: el.qty * 1,
			};
		});
		document
			.querySelector('.success-oder')
			.addEventListener('click', async () => {
				try {
					const name = document.querySelector('#nameUser').value;
					const email = document.querySelector('#emailUser').value;
					const phone =
						document.querySelector('#phoneNumberUser').value;
					const address =
						document.querySelector('#addressUser').value;
					const idUser =
						document.querySelector('#emailUser').dataset.idUser;
					const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('order', {
						name,
						email,
						phone,
						address,
						products: productSubmit,
						idUser,
					});
					// toast('success', res)

					if (res.status === 200) {
						document.querySelector(
							'.container',
						).innerHTML = `<div class="success-checkout">
							Bạn đã đặt hàng thành công. <a href="/">Quay về trang chủ</a>
							</div>`;
					}
				} catch (error) {
					(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error);
				}
			});
	} else {
		const products = JSON.parse(localStorage.getItem('cart'));
		renderData(products);
		const productSubmit = products.map((el) => {
			return {
				product: el.productID,
				quantity: el.qty * 1,
			};
		});
		document
			.querySelector('.success-oder')
			.addEventListener('click', async () => {
				try {
					const name = document.querySelector('#nameUser').value;
					const email = document.querySelector('#emailUser').value;
					const phone =
						document.querySelector('#phoneNumberUser').value;
					const address =
						document.querySelector('#addressUser').value;
					const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('order', {
						name,
						email,
						phone,
						address,
						products: productSubmit,
					});
					// toast('success', res)

					if (res.status === 200) {
						document.querySelector(
							'.container',
						).innerHTML = `<div class="success-checkout">
							Bạn đã đặt hàng thành công. <a href="/">Quay về trang chủ</a>
							</div>`;
					}
				} catch (error) {
					(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error);
				}
			});
	}
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
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cart */ "./public/js/view/cart.js");
/* harmony import */ var _checkout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./checkout */ "./public/js/view/checkout.js");




$(document).ready(async () => {
	const checkLogin = document.querySelector('#isLogin');
	const checkCheckout = document.querySelector('#checkout');
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

		document
			.querySelector('.btn-add-review')
			.addEventListener('click', async () => {
				const name = document.querySelector('#nameReview').value;
				const email = document.querySelector('#emailReview').value;
				const rating = document.querySelector('#ratingReview').value;
				const review = document.querySelector('#content').value;
				const product = document
					.querySelector('.product-single')
					.getAttribute('data-id');

				const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('review', {
					name,
					email,
					rating,
					review,
					product,
				});
				console.log(res);
			});
	}

	if (checkCheckout) {
		(0,_checkout__WEBPACK_IMPORTED_MODULE_3__.checkout)();
	} else {
		document.querySelector('.btn-search').addEventListener('click', (e) => {
			$('.search').toggleClass('active');
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

		if (document.querySelector('.product-add-to-cart')) {
			document
				.querySelector('.product-add-to-cart')
				.addEventListener('click', () => (0,_cart__WEBPACK_IMPORTED_MODULE_2__.addProductUser)());
		}

		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('cart');
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});

		(0,_cart__WEBPACK_IMPORTED_MODULE_2__.renderCart)(productsRender, true);
	} else {
		// Render Cart
		if (!checkCheckout) {
			const products = JSON.parse(localStorage.getItem('cart'));
			if (products) {
				(0,_cart__WEBPACK_IMPORTED_MODULE_2__.renderCart)(products);
			}

			//------------------------------
			if (document.querySelector('.product-add-to-cart')) {
				document
					.querySelector('.product-add-to-cart')
					.addEventListener('click', () => (0,_cart__WEBPACK_IMPORTED_MODULE_2__.addProductAnonymous)());
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
					const email =
						document.querySelector('.user-email-login').value;
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
						const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('user/register', {
							email,
							password,
							name,
							passwordConfirm,
						});

						if (res.status === 200) {
							location.reload();
						}
					} catch (error) {
						(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
					}
				});
		}
	}
	//------------------------------
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map