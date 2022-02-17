import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { toast } from './../util/toastify';
const createCategory = async (name) => {
	try {
		const res = await postDataAPI('category', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const deleteCategory = async (id) => {
	try {
		const res = await deleteDataAPI(`category/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
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
		toast('danger', error.response.data.message);
	}
};

const renderCategory = async () => {
	const tableList = $('#table')[0];
	const sort = document.querySelector('.filter').value;

	const BuildPage = async () => {
		const { data } = await getDataAPI(`category?sort=${sort}`);
		const listCategory = data.data;

		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
					<tr>
						<th class="col">Tên Danh Mục</th>
						<th class="col">Slug</th>
						<th class="col">Ngày Đăng</th>
						<th class="col"></th>
					</tr>
				</thead>
				<tbody >` +
				listCategory
					.slice(min, max)
					.map((category) => {
						return `
							<tr class="item-list" data-id=${
								category._id
							}  data-bs-toggle="modal" data-bs-target="#infoModal">
								<td class="info">${category.name}</td>
								<td class="slug">${category.slug}</td>
								<td class="date">${new Date(category.createdAt).toLocaleDateString()}</td>
								<td class="col-lg-2 col-sm-2 col-4 col-action text-end">
									<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
									<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
								</td>
							</tr>`;
					})
					.join('') +
				`</tbody>`;

			buildPagination(listCategory.length);
		};

		pagination(buildList);
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		try {
			const addCategoryButton = $('.btn-addCategory')[0];

			addCategoryButton.onclick = async (e) => {
				const name = document.querySelector('#nameCategory').value;
				if (!name) {
					return toast('danger', 'Vui lòng nhập tên danh mục');
				}
				const isSuccess = await createCategory(name);
				if (isSuccess) {
					document.querySelector('#nameCategory').value = '';
					$('#addNewModal').modal('hide');
					BuildPage();
					toast('success', 'Thêm mới thành công');
				}
			};
		} catch (error) {
			toast('danger', error.response.data.message);
		}
	});

	//----------------------------------------

	// Delete category
	const deleteCategoryButton = $('.btn-delete')[0];

	$('#deleteModal').on('show.bs.modal', function (e) {
		try {
			// get row
			const item = $(e.relatedTarget).closest('.item-list');
			const itemId = item.attr('data-id');

			deleteCategoryButton.setAttribute('delete-id', itemId);

			deleteCategoryButton.onclick = async (e) => {
				const deleteId = deleteCategoryButton.getAttribute('delete-id');
				const isSuccess = await deleteCategory(deleteId);
				if (isSuccess) {
					$('#deleteModal').modal('hide');
					toast('success', 'Xoá thành công');
					BuildPage();
				}
			};
		} catch (error) {
			toast('danger', error.response.data.message);
		}
	});

	//------------------------------

	// Update category
	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		try {
			const item = $(e.relatedTarget).closest('.item-list');
			const itemId = item.attr('data-id');
			const itemName = item.find('.info')[0].innerText;

			// Set giá trị khi hiện modal update
			$('#nameCategoryUpdate')[0].value = itemName;

			const updateCategoryButton = $('.btn-update-category')[0];

			updateCategoryButton.setAttribute('update-id', itemId);
			updateCategoryButton.onclick = async (e) => {
				const deleteId = updateCategoryButton.getAttribute('update-id');
				const name = $('#nameCategoryUpdate')[0].value;
				if (!name) {
					return toast('danger', 'Vui lòng nhập tên danh mục');
				}

				const isSuccess = await updateCategory(deleteId, {
					name,
				});

				if (isSuccess) {
					$('#updateModal').modal('hide');
					BuildPage();
					toast('success', 'Cập nhật thành công');
				}
			};
		} catch (error) {
			toast('danger', error.response.data.message);
		}
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.info')[0].innerText;
		const itemSlug = item.find('.slug')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameCategoryInfo')[0].value = itemName;
		$('#slugInfo')[0].value = itemSlug;
	});

	BuildPage();
};

export { renderCategory };
