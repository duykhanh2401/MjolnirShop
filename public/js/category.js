import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from './fetchAPI';

const createCategory = async (name) => {
	try {
		const res = await postDataAPI('category', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const deleteCategory = async (id) => {
	try {
		const res = await deleteDataAPI(`category/${id}`);
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
		const res = await patchDataAPI(`category/${id}`, data);
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
		const { data } = await getDataAPI('category');
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

export { createCategory, deleteCategory, updateCategory, renderCategory };
