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
/* harmony export */   "addProductUser": () => (/* binding */ addProductUser)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../util/toastify */ "./public/js/util/toastify.js");



const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const removeProduct = async (e) => {
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
};

const renderCart = (products) => {
	const cartRender = document.querySelectorAll('.table.table-cart');

	if (products.length) {
		cartRender.forEach((el, index) => {
			let totalPrice = 0;
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
						<td class="w-25">
							<a href="/category/${product.category[0].slug}/${product.slug}">
							<img class="img-fluid img-thumbnail" src=${product.image} alt="Sheep" />
							</a>
							</td>
							<td>${product.name}</td>
							<td>${formatter.format(product.price)}</td>

							<td class="qty quantity-control">
							${
								cartRender.length === 1
									? `
							<span class="qty">${product.qty}</span>
							 `
									: index === 0
									? `<button data-id=${product.productID} class="dash-product"><i class="bi bi-dash-lg"></i></button>
									<span class="qty qty-cart-page">${product.qty}</span>
									<button data-id=${product.productID} class="plus-product">
									<i class="bi bi-plus-lg" ></i>
									</button> `
									: `
									<span class="qty">${product.qty}</span>
									 `
							}
							
							</td>
							<td data-id=${
								product.productID
							} class="remove-product"><a class="btn btn-danger btn-sm" href="#"><i class="bi bi-x"></i></a></td>
						</tr>`;
					})
					.join('') +
				`</tbody>`;
			document.querySelectorAll('.total-price')[
				index
			].innerHTML = `Tạm Tính: <span class="text-success "> ${formatter.format(
				totalPrice,
			)} <span/>`;
		});

		document
			.querySelectorAll('.navigation-cart')
			.forEach((el) => el.classList.remove('disabled'));

		if (cartRender.length === 2) {
			document.querySelectorAll('.dash-product').forEach((el) => {
				el.addEventListener('click', (e) => {
					const qty = $(
						`.dash-product[data-id=${e.currentTarget.dataset.id}] ~ .qty-cart-page`,
					)[0].innerHTML;
					console.log(qty);
					if (qty * 1 == 1) {
						removeProduct(e);
					} else {
						updateProduct(e.currentTarget.dataset.id, -1);
					}
				});
			});

			document.querySelectorAll('.plus-product').forEach((el) =>
				el.addEventListener('click', (e) => {
					updateProduct(e.currentTarget.dataset.id, 1);
				}),
			);
		}
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
		el.addEventListener('click', (e) => removeProduct(e));
	});
};

const updateProduct = async (id, qty) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('cart/addProduct', {
			product: id,
			quantity: qty,
		});
		if (res.status === 200) {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Đã cập nhật giỏ hàng');
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
	} catch (error) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
	}
};

const addProductUser = async () => {
	try {
		const productID = document
			.querySelector('.product-single')
			.getAttribute('data-id');
		const qty = document.querySelector('.qty').innerText;

		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('cart/addProduct', {
			product: productID,
			quantity: qty,
		});
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
	} catch (error) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
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
	const cartData = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('cart');
	const productsRender = cartData.data.data.map((productItem) => {
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
				const phone = document.querySelector('#phoneNumberUser').value;
				const address = document.querySelector('#addressUser').value;
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

				if (res.status === 200) {
					document.querySelector(
						'.container',
					).innerHTML = `<div class="success-checkout">
							Bạn đã đặt hàng thành công. <a href="/">Quay về trang chủ</a>
							</div>`;

					await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.deleteDataAPI)('cart/removeAllProducts');
				}
			} catch (error) {
				(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
			}
		});
};




/***/ }),

/***/ "./public/js/view/me.js":
/*!******************************!*\
  !*** ./public/js/view/me.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderMe": () => (/* binding */ renderMe)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../util/toastify */ "./public/js/util/toastify.js");


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
			const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)(`order/${itemId}`);
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
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
		}
	});

	$('#addNewModal').on('shown.bs.modal', async function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		try {
			const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)(`order/${itemId}`);
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

						const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('review', {
							rating,
							review,
							idProduct: productReview,
						});

						if (res.status === 200) {
							(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('success', 'Đánh giá thành công');
							setTimeout(() => {
								location.reload();
							}, 3000);
						}
					} catch (e) {
						(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', e.message);
					}
				});
		} catch (error) {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_1__.toast)('danger', error.response.data.message);
		}
	});

	document
		.querySelector('.button-update-name')
		.addEventListener('click', async () => {
			const name = document.querySelector('.user-name-update').value;
			const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('user/updateMe', { name });
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
			const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('user/updateMyPassword', {
				passwordCurrent,
				password,
				passwordConfirm,
			});
			if (res.status === 200) {
				location.reload();
			}
		});
};




/***/ }),

/***/ "./public/js/view/product.js":
/*!***********************************!*\
  !*** ./public/js/view/product.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderProduct": () => (/* binding */ renderProduct)
/* harmony export */ });
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cart */ "./public/js/view/cart.js");


const renderProduct = async () => {
	let quantity = document.querySelector('.qty').innerText;
	document.querySelector('i.bi.bi-dash-lg').addEventListener('click', () => {
		if (quantity > 0) {
			document.querySelector('.qty').innerText = quantity * 1 - 1;
			quantity--;
		}
	});

	document.querySelector('i.bi.bi-plus-lg').addEventListener('click', () => {
		const max = document.querySelector('.max-quantity').innerText * 1;
		if (quantity < max) {
			document.querySelector('.qty').innerText = quantity * 1 + 1;
			quantity++;
		}
	});

	document
		.querySelector('.logout-button')
		.addEventListener('click', async (e) => {
			const res = await getDataAPI('user/logout');

			if (res.status === 200) {
				location.reload();
			}
		});

	if (document.querySelector('.product-add-to-cart')) {
		document
			.querySelector('.product-add-to-cart')
			.addEventListener('click', () => (0,_cart__WEBPACK_IMPORTED_MODULE_0__.addProductUser)());
	}

	const res = await getDataAPI('cart');
	const productsRender = res.data.data.map((productItem) => {
		const { product } = productItem;
		product.qty = productItem.quantity;
		product.productID = product._id;
		return product;
	});

	(0,_cart__WEBPACK_IMPORTED_MODULE_0__.renderCart)(productsRender);

	document.querySelector('.product-order').addEventListener('click', () => {
		(0,_cart__WEBPACK_IMPORTED_MODULE_0__.addProductUser)();
	});
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
/* harmony import */ var _checkout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkout */ "./public/js/view/checkout.js");
/* harmony import */ var _me__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./me */ "./public/js/view/me.js");
/* harmony import */ var _product__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./product */ "./public/js/view/product.js");
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cart */ "./public/js/view/cart.js");







const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

$(document).ready(async () => {
	const checkLogin = document.querySelector('#isLogin');
	const checkCheckout = document.querySelector('#checkout');
	const checkMePage = document.querySelector('#me');
	// handle change quantity
	if (document.querySelector('.product-single')) {
		(0,_product__WEBPACK_IMPORTED_MODULE_4__.renderProduct)();
	}

	if (checkMePage) {
		(0,_me__WEBPACK_IMPORTED_MODULE_3__.renderMe)();
	}

	if (checkCheckout) {
		(0,_checkout__WEBPACK_IMPORTED_MODULE_2__.checkout)();
	} else {
		document.querySelector('.btn-search').addEventListener('click', (e) => {
			$('.search').toggleClass('active');
		});
	}

	if (checkLogin) {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('cart');
		console.log(res.data.data);
		const productsRender = res.data.data.map((productItem) => {
			const { product } = productItem;
			product.qty = productItem.quantity;
			product.productID = product._id;
			return product;
		});

		(0,_cart__WEBPACK_IMPORTED_MODULE_5__.renderCart)(productsRender);
	} else {
		// Render Cart
		if (!checkCheckout) {
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

			document.querySelectorAll('.login-button').forEach((el) =>
				el.addEventListener('click', (e) => {
					activeForm('login-active ');
				}),
			);

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
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map