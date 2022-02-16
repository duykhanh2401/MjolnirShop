import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { toast } from './../util/toastify';

const createAuthor = async (name) => {
	try {
		const res = await postDataAPI('author', { name });
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const deleteAuthor = async (id) => {
	try {
		const res = await deleteDataAPI(`author/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const updateAuthor = async (id, data) => {
	try {
		data.slug = data.slug.replace(/ /g, '-');
		const res = await patchDataAPI(`author/${id}`, data);
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
		const { data } = await getDataAPI('author');
		const listAuthor = data.data;

		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
					<tr>
						<th class="col">Tên Tác Giả</th>
						<th class="col">Slug</th>
						<th class="col">Ngày Đăng</th>
						<th class="col"></th>
					</tr>
				</thead>
		<tbody >` +
				listAuthor
					.slice(min, max)
					.map((author) => {
						return `
				<tr class="item-list" data-id=${
					author._id
				} data-bs-toggle="modal" data-bs-target="#infoModal">
				
					<td class="info">${author.name}</td>
					<td class="slug"><span>${author.slug}</span></td>
					<td class="date"><span>${new Date(
						author.createdAt,
					).toLocaleDateString()}</span></td>
					<td class="col-lg-2 col-sm-2 col-4 col-action text-end">
						<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
						<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
					</td>
			
			</tr>
				`;
					})
					.join('') +
				`</tbody>`;

			buildPagination(listAuthor.length);
		};

		pagination(buildList);
	};

	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		const addAuthorButton = $('.btn-addAuthor')[0];

		addAuthorButton.onclick = async (e) => {
			const name = document.querySelector('#nameAuthor').value;
			if (!name) {
				return toast('danger', 'Vui lòng nhập tên tác giả');
			}
			const isSuccess = await createAuthor(name);
			if (isSuccess) {
				document.querySelector('#nameAuthor').value = '';
				$('#addNewModal').modal('hide');
				BuildPage();
				toast('success', 'Thêm mới thành công');
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
				toast('success', 'Xoá thành công');
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
		const itemName = item.find('.info')[0].innerText;
		const itemSlug = item.find('.slug')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameAuthorUpdate')[0].value = itemName;
		$('#slugUpdate')[0].value = itemSlug;

		const updateAuthorButton = $('.btn-update-author')[0];

		updateAuthorButton.setAttribute('update-id', itemId);
		updateAuthorButton.onclick = (e) => {
			const deleteId = updateAuthorButton.getAttribute('update-id');
			const name = $('#nameAuthorUpdate')[0].value;
			const slug = $('#slugUpdate')[0].value;
			if (!name) {
				return toast('danger', 'Vui lòng nhập tên tác giả');
			}
			const isSuccess = updateAuthor(deleteId, { name, slug });

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
				toast('success', 'Cập nhật thành công');
			}
		};
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		const itemName = item.find('.info')[0].innerText;
		const itemSlug = item.find('.slug')[0].innerText;

		// Set giá trị khi hiện modal update
		$('#nameAuthorInfo')[0].value = itemName;
		$('#slugInfo')[0].value = itemSlug;
	});
	BuildPage();
};

export { renderAuthor };
