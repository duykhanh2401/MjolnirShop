/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/category.js":
/*!*******************************!*\
  !*** ./public/js/category.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createCategory": () => (/* binding */ createCategory),
/* harmony export */   "deleteCategory": () => (/* binding */ deleteCategory),
/* harmony export */   "updateCategory": () => (/* binding */ updateCategory),
/* harmony export */   "renderCategory": () => (/* binding */ renderCategory)
/* harmony export */ });
/* harmony import */ var _fetchAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetchAPI */ "./public/js/fetchAPI.js");


const createCategory = async (name) => {
	try {
		const res = await (0,_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.postDataAPI)('category', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const deleteCategory = async (id) => {
	try {
		const res = await (0,_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.deleteDataAPI)(`category/${id}`);
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
		const res = await (0,_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.patchDataAPI)(`category/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const buildPage = () => {};

const renderCategory = async () => {
	const tableList = $('#table')[0];

	const buildList = async () => {
		const { data } = await (0,_fetchAPI__WEBPACK_IMPORTED_MODULE_0__.getDataAPI)('category');
		const listCategory = data.data;
		tableList.innerHTML = listCategory
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
	};

	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addCategoryButton = $('.btn-addCategory')[0];

		addCategoryButton.onclick = async (e) => {
			const name = document.querySelector('#nameCategory').value;

			const isSuccess = await createCategory(name);
			if (isSuccess) {
				document.querySelector('#nameCategory').value = '';
				$('#addNewModal').modal('hide');
				buildList();
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
				buildList();
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
				buildList();
			}
		};
	});

	buildList();
};




/***/ }),

/***/ "./public/js/fetchAPI.js":
/*!*******************************!*\
  !*** ./public/js/fetchAPI.js ***!
  \*******************************/
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
/*!****************************!*\
  !*** ./public/js/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./category */ "./public/js/category.js");


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
		(0,_category__WEBPACK_IMPORTED_MODULE_0__.renderCategory)();
		// Add new category

		// ------------------------------
	}
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map