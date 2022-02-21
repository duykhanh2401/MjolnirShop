import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';
import { toast } from './../util/toastify';
import { convert } from '../util/convertString';

const createUser = async (data) => {
	try {
		const res = await postDataAPI('user', data);
		if (res.data.status === 'success') {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};
const deleteUser = async (id) => {
	try {
		const res = await deleteDataAPI(`user/${id}`);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const updateUser = async (id, data) => {
	try {
		const res = await patchDataAPI(`user/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		toast('danger', error.response.data.message);
	}
};

const renderUser = async () => {
	const tableList = $('#table')[0];

	const BuildPage = async () => {
		const sort = document.querySelector('.filter').value;
		let search = document.querySelector('.search').value;

		const { data } = await getDataAPI(`user?sort=${sort}`);
		const listUser = data.data;
		if (!search) {
			search = '';
		}
		const listRender = listUser.filter((item) =>
			convert(item.name).includes(convert(search)),
		);
		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
					<tr>
						<th class="col">Tên người dùng</th>
						<th class="col">Email</th>
						<th class="col">Chức vụ</th>
						<th class="col">Trạng thái</th>
						<th class="col"></th>
					</tr>
				</thead>
				<tbody >` +
				listRender
					.slice(min, max)
					.map((user) => {
						return `
							<tr class="item-list" data-id=${
								user._id
							}  data-bs-toggle="modal" data-bs-target="#infoModal">
								<td class="info">${user.name}</td>
								<td class="email">${user.email}</td>
								<td class="role" value=${user.role}>${
							user.role === 'admin'
								? 'Quản trị viên'
								: 'Người dùng'
						}</td>
								<td class="role">${
									user.active === true
										? 'Đang hoạt động'
										: 'Không hoạt động'
								}</td>
								<td class="col-lg-2 col-sm-2 col-4 col-action text-end">
									<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Sửa</div>
									${
										user.role == 'admin'
											? ''
											: '<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>'
									}
									
								</td>
							</tr>`;
					})
					.join('') +
				`</tbody>`;

			buildPagination(listRender.length);
		};

		pagination(buildList);
	};
	document.querySelector('.search').addEventListener('change', function () {
		BuildPage();
	});
	// Add New Category
	$('#addNewModal').on('shown.bs.modal', function (e) {
		try {
			const addCategoryButton = $('.btn-addUser')[0];

			addCategoryButton.onclick = async (e) => {
				const name = document.querySelector('#nameUser').value;
				const email = document.querySelector('#emailUser').value;
				const password = document.querySelector('#passwordUser').value;
				const role = document.querySelector('#roleUser').value;

				const isSuccess = await createUser({
					name,
					email,
					password,
					role,
					passwordConfirm: password,
				});
				if (isSuccess) {
					document.querySelector('#nameUser').value = '';
					document.querySelector('#emailUser').value = '';
					document.querySelector('#passwordUser').value = '';
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
	const deleteUserButton = $('.btn-delete')[0];
	$('#deleteModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		deleteUserButton.setAttribute('delete-id', itemId);

		deleteUserButton.onclick = async (e) => {
			const deleteId = deleteUserButton.getAttribute('delete-id');
			const isSuccess = await deleteUser(deleteId);
			if (isSuccess) {
				$('#deleteModal').modal('hide');
				BuildPage();
				toast('success', 'Xoá thành công');
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
		const itemEmail = item.find('.email')[0].innerText;
		const itemRole = item.find('.role')[0].getAttribute('value');

		// Set giá trị khi hiện modal update

		document.querySelector('#nameUserUpdate').value = itemName;
		document.querySelector('#emailUserUpdate').value = itemEmail;
		const updateUserButton = $('.btn-update-user')[0];

		updateUserButton.setAttribute('update-id', itemId);
		updateUserButton.onclick = async (e) => {
			const updateId = updateUserButton.getAttribute('update-id');
			const name = document.querySelector('#nameUserUpdate').value;
			const email = document.querySelector('#emailUserUpdate').value;

			const isSuccess = await updateUser(updateId, { name, email });

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
		const itemEmail = item.find('.email')[0].innerText;
		const itemRole = item.find('.role')[0].getAttribute('value');

		// Set giá trị khi hiện modal update

		document.querySelector('#nameUserInfo').value = itemName;
		document.querySelector('#emailUserInfo').value = itemEmail;
		document.querySelector('#roleUserInfo').value = itemRole;
	});

	BuildPage();
};

export { renderUser };
