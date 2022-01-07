import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from './util/fetchAPI';
import { pagination } from './util/pagination';
import { toast } from './util/toastify';
import { uploadImage } from './util/uploadImage';

const createProduct = async (data) => {
	try {
		const res = await postDataAPI('product', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

const deleteProduct = async (id) => {
	try {
		const res = await deleteDataAPI(`product/${id}`);
		console.log(res);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
	}
};

const updateProduct = async (id, data) => {
	try {
		data.slug = data.slug.replace(/ /g, '-');
		const res = await patchDataAPI(`product/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		toast('danger', error);
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
			const { data } = await getDataAPI('product');
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

			pagination(buildList);
		} catch (error) {
			toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
		}
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addProductButton = $('.btn-addProduct')[0];

		document
			.querySelector('.uploadButton')
			.addEventListener('click', async () => {
				const file = document.querySelector('#imageProduct').files[0];
				const src = await uploadImage(file);
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
				toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
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
					toast('success', 'Xoá thành công');
				}
			};
		} catch (error) {
			toast('danger', 'Có lỗi xảy ra. Vui lòng thử lại sau');
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
				const src = await uploadImage(file);
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

export { renderProduct };

//value.replace(/\D/g, '');
