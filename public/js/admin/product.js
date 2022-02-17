import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { toast } from '../util/toastify';
import { uploadImage } from '../util/uploadImage';

const createProduct = async (data) => {
	try {
		const res = await postDataAPI('product', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const deleteProduct = async (id) => {
	try {
		const res = await deleteDataAPI(`product/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const updateProduct = async (id, data) => {
	try {
		const res = await patchDataAPI(`product/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
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
			const sort = document.querySelector('.filter').value;

			const { data } = await getDataAPI(`product?sort=${sort}`);
			const listProduct = data.data;
			const buildList = async (buildPagination, min, max) => {
				tableList.innerHTML =
					`<thead>
				<tr>
					<th class="col"></th>
					<th class="col">Tên sản phẩm</th>
					<th class="col">Giá sản phẩm</th>
					<th class="col">Số lượng</th>
					<th class="col"></th>
				</tr>
			</thead>
	<tbody >` +
					listProduct
						.slice(min, max)
						.map((product) => {
							return `
							
						<tr class="item-list" data-id=${
							product._id
						} data-bs-toggle="modal" data-bs-target="#infoModal">
								<td class="image-product"><img src=${product.image} alt=${product.name}  /></td>
								<td class="info">${product.name}
								<div class="d-none author-value">${product.author
									.map((e) => e.id)
									.join(',')}</div>
									<div class="d-none category-value">${product.category
										.map((e) => e.id)
										.join(',')}</div>
										<div class="d-none slug">${product.slug}</div>
								<div class="d-none description">${product.description}</div>
								<div class="col-lg-1 col-sm-2 col-4 col-date"></div></td>
								
								<td class="price">${formatter.format(product.price)} </td>
								<td class="quantity">${product.quantity}</td>
							<td>
								<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
								<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
							</td>
							
					</tr>
					`;
						})
						.join('');

				buildPagination(listProduct.length);
			};

			pagination(buildList);
		} catch (error) {
			toast('danger', error.response.data.message);
		}
	};

	// Add New
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
				if (
					!name ||
					!price ||
					!quantity ||
					!author ||
					!category ||
					!description ||
					!image
				) {
					return toast('danger', 'Vui lòng nhập đủ các trường');
				}
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
					$('#authorSelect').val([]).trigger('chosen:updated');
					$('#categorySelect').val([]).trigger('chosen:updated');
					$('.imgShow')[0].setAttribute('src', '');
					document.querySelector('#description').value = '';

					$('#addNewModal').modal('hide');
					BuildPage();
					toast('success', 'Thêm mới thành công');
				}
			} catch (error) {
				toast('danger', error.response.data.message);
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
			toast('danger', error.response.data.message);
		}
		// get row
	});

	//------------------------------

	// Update category
	$('#updateModal').on('show.bs.modal', function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.info')[0].innerText;
		const itemPrice = item.find('.price')[0].innerText.replace(/\D/g, '');
		const itemQuantity = item.find('.quantity')[0].innerText;
		const itemAuthor = item
			.find('.info .author-value')[0]
			.innerText.split(',');
		const itemCategory = item
			.find('.info .category-value')[0]
			.innerText.split(',');
		const itemDescription = item.find('.info .description')[0].innerText;
		const image = item.find('.image-product img').attr('src');

		// Set giá trị khi hiện modal update
		$('#nameProductUpdate')[0].value = itemName;
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
			const image = document
				.querySelector('.imgShowUpdate')
				.getAttribute('src');

			const updateId = updateProductButton.getAttribute('update-id');
			if (
				!name ||
				!price ||
				!quantity ||
				!author ||
				!category ||
				!description
			) {
				return toast('danger', 'Vui lòng nhập đủ các trường');
			}
			const isSuccess = await updateProduct(updateId, {
				name,
				price,
				quantity,
				author,
				category,
				description,
				image,
			});

			// Clear form
			if (isSuccess) {
				document.querySelector('#nameProductUpdate').value = '';
				document.querySelector('#priceProductUpdate').value = '';

				document.querySelector('#quantityProductUpdate').value = '';
				$('#authorSelectUpdate').val([]).trigger('chosen:updated');
				$('#categorySelectUpdate').val([]).trigger('chosen:updated');
				$('.imgShowUpdate')[0].setAttribute('src', '');
				document.querySelector('#descriptionProductUpdate').value = '';

				$('#updateModal').modal('hide');
				BuildPage();
				toast('success', 'Cập nhật thành công');
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.info')[0].innerText;
		const itemSlug = item.find('.info .slug')[0].innerText;
		const itemPrice = item.find('.price')[0].innerText.replace(/\D/g, '');
		const itemQuantity = item.find('.quantity')[0].innerText;
		const itemAuthor = item
			.find('.info .author-value')[0]
			.innerText.split(',');
		const itemCategory = item
			.find('.info .category-value')[0]
			.innerText.split(',');
		const itemDescription = item.find('.info .description')[0].innerText;
		const image = item.find('.image-product img').attr('src');
		// Set giá trị khi hiện modal update
		$('#nameProductInfo')[0].value = itemName;
		$('#slugProductInfo')[0].value = itemSlug;
		$('#priceProductInfo')[0].value = itemPrice;
		$('#quantityProductInfo')[0].value = itemQuantity;
		$('#descriptionProductInfo')[0].value = itemDescription;
		$('#authorSelectInfo').val(itemAuthor).trigger('chosen:updated');
		$('#categorySelectInfo').val(itemCategory).trigger('chosen:updated');
		$('.imgShowInfo')[0].setAttribute('src', image);
	});

	BuildPage();
};

export { renderProduct };

//value.replace(/\D/g, '');
