/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/author.js":
/*!*****************************!*\
  !*** ./public/js/author.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAuthor": () => (/* binding */ renderAuthor)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/pagination */ "./public/js/util/pagination.js");



const createAuthor = async (name) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('author', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const deleteAuthor = async (id) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.deleteDataAPI)(`author/${id}`);
		console.log(res);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const updateAuthor = async (id, data) => {
	try {
		data.slug = data.slug.replace(/ /g, '-');
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.patchDataAPI)(`author/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const renderAuthor = async () => {
	const tableList = $('#table')[0];

	const BuildPage = async () => {
		const { data } = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('author');
		const listAuthor = data.data;

		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML = listAuthor
				.slice(min, max)
				.map((author) => {
					return `
				<div class="item-list" data-id=${author._id}>
				<div class="row align-items-center">
					<div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
						<div class="itemside">
							<div class="info">${author.name}</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-4 col-8 col-slug"><span>${author.slug}</span></div>
					<div class="col-lg-1 col-sm-2 col-4 col-date"><span>${new Date(
						author.createdAt,
					).toLocaleDateString()}</span></div>
					<div class="col-lg-2 col-sm-2 col-4 col-action text-end">
						<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
						<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
					</div>
				</div>
			</div>
				`;
				})
				.join('');

			buildPagination(listAuthor.length);
		};

		(0,_util_pagination__WEBPACK_IMPORTED_MODULE_1__.pagination)(buildList);
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addAuthorButton = $('.btn-addAuthor')[0];

		addAuthorButton.onclick = async (e) => {
			const name = document.querySelector('#nameAuthor').value;

			const isSuccess = await createAuthor(name);
			if (isSuccess) {
				document.querySelector('#nameAuthor').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
			}
		};
	});

	//----------------------------------------

	// Delete category
	const deleteAuthorButton = $('.btn-delete')[0];
	$('#deleteModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		deleteAuthorButton.setAttribute('delete-id', itemId);

		deleteAuthorButton.onclick = async (e) => {
			const deleteId = deleteAuthorButton.getAttribute('delete-id');
			const isSuccess = await deleteAuthor(deleteId);
			if (isSuccess) {
				$('#deleteModal').modal('hide');
				BuildPage();
			}
		};
	});

	//------------------------------

	// Update category
	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.col-name .info')[0].innerText;
		const itemSlug = item.find('.col-slug span')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameAuthorUpdate')[0].value = itemName;
		$('#slugUpdate')[0].value = itemSlug;

		const updateAuthorButton = $('.btn-update-author')[0];

		updateAuthorButton.setAttribute('update-id', itemId);
		updateAuthorButton.onclick = (e) => {
			const deleteId = updateAuthorButton.getAttribute('update-id');
			const name = $('#nameAuthorUpdate')[0].value;
			const slug = $('#slugUpdate')[0].value;

			const isSuccess = updateAuthor(deleteId, { name, slug });

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
			}
		};
	});

	BuildPage();
};




/***/ }),

/***/ "./public/js/category.js":
/*!*******************************!*\
  !*** ./public/js/category.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderCategory": () => (/* binding */ renderCategory)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/pagination */ "./public/js/util/pagination.js");


const createCategory = async (name) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('category', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const deleteCategory = async (id) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.deleteDataAPI)(`category/${id}`);
		console.log(res);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const updateCategory = async (id, data) => {
	try {
		data.slug = data.slug.replace(/ /g, '-');
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.patchDataAPI)(`category/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const renderCategory = async () => {
	const tableList = $('#table')[0];

	const BuildPage = async () => {
		const { data } = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('category');
		const listCategory = data.data;

		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML = listCategory
				.slice(min, max)
				.map((category) => {
					return `
			<div class="item-list" data-id=${category._id}>
			<div class="row align-items-center">
				<div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
					<div class="itemside">
						<div class="info">${category.name}</div>
					</div>
				</div>
				<div class="col-lg-4 col-sm-4 col-8 col-slug"><span>${
					category.slug
				}</span></div>
				<div class="col-lg-1 col-sm-2 col-4 col-date"><span>${new Date(
					category.createdAt,
				).toLocaleDateString()}</span></div>
				<div class="col-lg-2 col-sm-2 col-4 col-action text-end">
					<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
					<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
				</div>
			</div>
		</div>
			`;
				})
				.join('');

			buildPagination(listCategory.length);
		};

		(0,_util_pagination__WEBPACK_IMPORTED_MODULE_1__.pagination)(buildList);
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addCategoryButton = $('.btn-addCategory')[0];

		addCategoryButton.onclick = async (e) => {
			const name = document.querySelector('#nameCategory').value;

			const isSuccess = await createCategory(name);
			if (isSuccess) {
				document.querySelector('#nameCategory').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
			}
		};
	});

	//----------------------------------------

	// Delete category
	const deleteCategoryButton = $('.btn-delete')[0];
	$('#deleteModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		deleteCategoryButton.setAttribute('delete-id', itemId);

		deleteCategoryButton.onclick = async (e) => {
			const deleteId = deleteCategoryButton.getAttribute('delete-id');
			const isSuccess = await deleteCategory(deleteId);
			if (isSuccess) {
				$('#deleteModal').modal('hide');
				BuildPage();
			}
		};
	});

	//------------------------------

	// Update category
	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.col-name .info')[0].innerText;
		const itemSlug = item.find('.col-slug span')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameCategoryUpdate')[0].value = itemName;
		$('#slugUpdate')[0].value = itemSlug;

		const updateCategoryButton = $('.btn-update-category')[0];

		updateCategoryButton.setAttribute('update-id', itemId);
		updateCategoryButton.onclick = (e) => {
			const deleteId = updateCategoryButton.getAttribute('update-id');
			const name = $('#nameCategoryUpdate')[0].value;
			const slug = $('#slugUpdate')[0].value;

			const isSuccess = updateCategory(deleteId, { name, slug });

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
			}
		};
	});

	BuildPage();
};




/***/ }),

/***/ "./public/js/login.js":
/*!****************************!*\
  !*** ./public/js/login.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { postDataAPI } = __webpack_require__(/*! ./util/fetchAPI */ "./public/js/util/fetchAPI.js");
const { toast } = __webpack_require__(/*! ./util/toastify */ "./public/js/util/toastify.js");

exports.login = async () => {
	document
		.querySelector('.loginSubmit')
		.addEventListener('click', async () => {
			try {
				const email = document.querySelector('.email').value;
				const password = document.querySelector('.password').value;

				const res = await postDataAPI('user/loginAdmin', {
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
};


/***/ }),

/***/ "./public/js/product.js":
/*!******************************!*\
  !*** ./public/js/product.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderProduct": () => (/* binding */ renderProduct)
/* harmony export */ });
/* harmony import */ var _util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/fetchAPI */ "./public/js/util/fetchAPI.js");
/* harmony import */ var _util_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/pagination */ "./public/js/util/pagination.js");
/* harmony import */ var _util_toastify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/toastify */ "./public/js/util/toastify.js");
/* harmony import */ var _util_uploadImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/uploadImage */ "./public/js/util/uploadImage.js");





const createProduct = async (data) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('product', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

const deleteProduct = async (id) => {
	try {
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.deleteDataAPI)(`product/${id}`);
		console.log(res);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

const updateProduct = async (id, data) => {
	try {
		data.slug = data.slug.replace(/ /g, '-');
		const res = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.patchDataAPI)(`product/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', error);
	}
};

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const renderProduct = () => {
	const tableList = $('#table')[0];

	const BuildPage = async () => {
		try {
			const { data } = await (0,_util_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('product');
			const listProduct = data.data;
			const buildList = async (buildPagination, min, max) => {
				tableList.innerHTML = listProduct
					.slice(min, max)
					.map((product) => {
						return `
						<div class="item-list" data-id=${product._id}>
						<div class="row align-items-center">
							<div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
								<div class="itemside">
									<div class="image-product"><img src=${product.image} alt=${
							product.name
						} /></div>
									<div class="info">${product.name}</div>
								</div>
							</div>
							<div class="d-none author-value">${product.author
								.map((e) => e.id)
								.join(',')}</div>
							<div class="d-none category-value">${product.category
								.map((e) => e.id)
								.join(',')}</div>
							<div class="d-none col-slug"><span>${product.slug}</span></div>
							<div class="d-none col-description"><span>${product.description}</span></div>
							<div class="col-lg-2 col-sm-2 col-4 col-price"><span>${formatter.format(
								product.price,
							)} </span></div>
							<div class="col-lg-2 col-sm-2 col-4 col-quantity"><span>${
								product.quantity
							}</span></div>
							<div class="col-lg-1 col-sm-2 col-4 col-date"><span></span></div>
							<div class="col-lg-2 col-sm-2 col-4 col-action text-end">
							<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
							<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
						</div>
						</div>
					</div>
					`;
					})
					.join('');

				buildPagination(listProduct.length);
			};

			(0,_util_pagination__WEBPACK_IMPORTED_MODULE_1__.pagination)(buildList);
		} catch (error) {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
		}
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addProductButton = $('.btn-addProduct')[0];

		document
			.querySelector('.uploadButton')
			.addEventListener('click', async () => {
				const file = document.querySelector('#imageProduct').files[0];
				const src = await (0,_util_uploadImage__WEBPACK_IMPORTED_MODULE_3__.uploadImage)(file);
				if (src) $('.imgShow')[0].setAttribute('src', src);
			});

		addProductButton.onclick = async (e) => {
			try {
				const name = document.querySelector('#nameProduct').value;
				const price = document.querySelector('#priceProduct').value;
				const quantity =
					document.querySelector('#quantityProduct').value;
				const author = $('#authorSelect').val();
				const category = $('#categorySelect').val();
				const description =
					document.querySelector('#description').value;
				const image = document
					.querySelector('.imgShow')
					.getAttribute('src');
				const isSuccess = await createProduct({
					name,
					price,
					quantity,
					author,
					category,
					description,
					image,
				});
				if (isSuccess) {
					document.querySelector('#nameProduct').value = '';
					document.querySelector('#priceProduct').value = '';

					document.querySelector('#quantityProduct').value = '';
					$('#authorSelect').val('').trigger('chosen:updated');
					$('#categorySelect').val('').trigger('chosen:updated');
					$('.imgShow')[0].setAttribute('src', '');
					document.querySelector('#description').value = '';

					$('#addNewModal').modal('hide');
					BuildPage();
				}
			} catch (error) {
				(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
			}
		};
	});

	//----------------------------------------

	// Delete category
	const deleteProductButton = $('.btn-delete')[0];
	$('#deleteModal').on('show.bs.modal', function (e) {
		try {
			const item = $(e.relatedTarget).closest('.item-list');
			const itemId = item.attr('data-id');

			deleteProductButton.setAttribute('delete-id', itemId);

			deleteProductButton.onclick = async (e) => {
				const deleteId = deleteProductButton.getAttribute('delete-id');
				const isSuccess = await deleteProduct(deleteId);
				if (isSuccess) {
					$('#deleteModal').modal('hide');
					BuildPage();
					(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('success', 'Xoá thành công');
				}
			};
		} catch (error) {
			(0,_util_toastify__WEBPACK_IMPORTED_MODULE_2__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
		}
		// get row
	});

	//------------------------------

	// Update category
	$('#updateModal').on('show.bs.modal', function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.col-name .info')[0].innerText;
		const itemSlug = item.find('.col-slug span')[0].innerText;
		const itemPrice = item
			.find('.col-price span')[0]
			.innerText.replace(/\D/g, '');
		const itemQuantity = item.find('.col-quantity span')[0].innerText;
		const itemAuthor = item.find('.author-value')[0].innerText.split(',');
		const itemCategory = item
			.find('.category-value')[0]
			.innerText.split(',');
		const itemDescription = item.find('.col-description span')[0].innerText;
		const image = item.find('.image-product img').attr('src');

		// Set giá trị khi hiện modal update
		$('#nameProductUpdate')[0].value = itemName;
		$('#slugProductUpdate')[0].value = itemSlug;
		$('#priceProductUpdate')[0].value = itemPrice;
		$('#quantityProductUpdate')[0].value = itemQuantity;
		$('#descriptionProductUpdate')[0].value = itemDescription;
		$('#authorSelectUpdate').val(itemAuthor).trigger('chosen:updated');
		$('#categorySelectUpdate').val(itemCategory).trigger('chosen:updated');
		$('.imgShowUpdate')[0].setAttribute('src', image);

		// Lắng nghe sự kiện upload ảnh
		document
			.querySelector('.uploadButtonUpdate')
			.addEventListener('click', async () => {
				const file = document.querySelector('#imageProductUpdate')
					.files[0];
				const src = await (0,_util_uploadImage__WEBPACK_IMPORTED_MODULE_3__.uploadImage)(file);
				if (src) $('.imgShowUpdate')[0].setAttribute('src', src);
			});

		// Update Product
		const updateProductButton = $('.btn-update-product')[0];
		updateProductButton.setAttribute('update-id', itemId);
		updateProductButton.onclick = async (e) => {
			const name = document.querySelector('#nameProductUpdate').value;
			const price = document.querySelector('#priceProductUpdate').value;
			const quantity = document.querySelector(
				'#quantityProductUpdate',
			).value;
			const author = $('#authorSelectUpdate').val();
			const category = $('#categorySelectUpdate').val();
			const description = document.querySelector(
				'#descriptionProductUpdate',
			).value;
			const slug = document.querySelector('#slugProductUpdate').value;
			const image = document
				.querySelector('.imgShowUpdate')
				.getAttribute('src');

			const updateId = updateProductButton.getAttribute('update-id');
			console.log(updateId);
			const isSuccess = await updateProduct(updateId, {
				name,
				price,
				quantity,
				author,
				category,
				description,
				image,
				slug,
			});

			// Clear form
			if (isSuccess) {
				document.querySelector('#nameProductUpdate').value = '';
				document.querySelector('#priceProductUpdate').value = '';

				document.querySelector('#quantityProductUpdate').value = '';
				$('#authorSelectUpdate').val('').trigger('chosen:updated');
				$('#categorySelectUpdate').val('').trigger('chosen:updated');
				$('.imgShowUpdate')[0].setAttribute('src', '');
				document.querySelector('#descriptionProductUpdate').value = '';

				$('#updateModal').modal('hide');
				BuildPage();
			}
		};
	});

	BuildPage();
};



//value.replace(/\D/g, '');


/***/ }),

/***/ "./public/js/util/fetchAPI.js":
/*!************************************!*\
  !*** ./public/js/util/fetchAPI.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./public/js/util/pagination.js":
/*!**************************************!*\
  !*** ./public/js/util/pagination.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pagination": () => (/* binding */ pagination)
/* harmony export */ });
const pagination = (buildList) => {
	let currentPage = 1;
	let namesPerPage = 5;

	const calcPages = (number) => {
		return Math.ceil(number / namesPerPage);
	};

	let pages = calcPages(currentPage);
	const handleClick = (id) => {
		if (id === 'prev') {
			currentPage--;
		} else if (id === 'next') {
			currentPage++;
		} else {
			currentPage = id;
		}
		buildList(
			buildPagination,
			(currentPage - 1) * namesPerPage,
			currentPage * namesPerPage,
		);
	};

	const buildPagination = (number) => {
		let prevButton, nextButton;

		pages = calcPages(number);
		if (currentPage === 1) {
			prevButton = false;
		} else {
			prevButton = true;
		}

		if (currentPage === pages) {
			nextButton = false;
		} else {
			nextButton = true;
		}

		if (pages === 0) {
			nextButton = false;
			prevButton = false;
		}
		let arrayNumber = [];
		for (var i = 1; i <= pages; i++) {
			arrayNumber.push(i);
		}
		const renderIndex = arrayNumber
			.map((item) => {
				return `
			<li class="page-item number ${
				item === currentPage ? 'active' : ''
			}"> <a class="page-link" href="#">${item}</a></li>
			`;
			})
			.join('');

		$('.pagination')[0].innerHTML = `
		<div aria-label="Page navigation example">
		<ul class="pagination justify-content-center">
		${
			prevButton
				? '<li class="page-item prev"><a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a></li>'
				: ''
		}
			${renderIndex}
		${
			nextButton
				? '<li class="page-item next"><a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a></li>'
				: ''
		}

		  
		</ul>
	  </div>
		`;

		$('.prev').click(() => handleClick('prev'));
		$('.next').click(() => handleClick('next'));
		$('.page-item.number').each(function (index) {
			$(this).click(() => handleClick(index + 1));
		});
	};

	buildList(
		buildPagination,
		(currentPage - 1) * namesPerPage,
		currentPage * namesPerPage,
	);
};


/***/ }),

/***/ "./public/js/util/toastify.js":
/*!************************************!*\
  !*** ./public/js/util/toastify.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./public/js/util/uploadImage.js":
/*!***************************************!*\
  !*** ./public/js/util/uploadImage.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uploadImage": () => (/* binding */ uploadImage)
/* harmony export */ });
/* harmony import */ var _toastify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toastify */ "./public/js/util/toastify.js");

const uploadImage = async (file) => {
	try {
		const formData = new FormData();

		formData.append('file', file);
		formData.append('upload_preset', 'BookShop');

		const { data } = await axios.post(
			'https://api.cloudinary.com/v1_1/duykhanh2401/image/upload',
			formData,
		);
		(0,_toastify__WEBPACK_IMPORTED_MODULE_0__.toast)('success', 'Đăng ảnh thành công');

		return data.secure_url;
	} catch (error) {
		(0,_toastify__WEBPACK_IMPORTED_MODULE_0__.toast)('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./public/js/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./category */ "./public/js/category.js");
/* harmony import */ var _author__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./author */ "./public/js/author.js");
/* harmony import */ var _product__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product */ "./public/js/product.js");
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login */ "./public/js/login.js");





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
		(0,_category__WEBPACK_IMPORTED_MODULE_0__.renderCategory)();
	}
	if (author) {
		(0,_author__WEBPACK_IMPORTED_MODULE_1__.renderAuthor)();
	}

	if (product) {
		$('.chosen-select').chosen({
			no_results_text: 'Không có thông tin trùng khớp',
		});
		(0,_product__WEBPACK_IMPORTED_MODULE_2__.renderProduct)();
	}

	if (loginPage) {
		(0,_login__WEBPACK_IMPORTED_MODULE_3__.login)();
	}
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map