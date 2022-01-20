import {
	postDataAPI,
	deleteDataAPI,
	patchDataAPI,
	getDataAPI,
} from '../util/fetchAPI';
import { pagination } from '../util/pagination';

const formatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const getStatus = (input) => {
	switch (input) {
		case 'Order Placed':
			return 'Chờ xác nhận';
		case 'Order Confirmed':
			return 'Đã xác nhận';
		case 'Shipped Out':
			return 'Đang vận chuyển';
		case 'Order Received':
			return 'Đã nhận hàng';
		case 'Cancel The Order':
			return 'Huỷ đơn hàng';
	}
};

const deleteOrder = async (id) => {
	try {
		const res = await deleteDataAPI(`order/${id}`);
		console.log(res);
		if (res.status === 204) {
			return true;
		}
	} catch (error) {
		console.log('error');
	}
};

const updateOrder = async (id, data) => {
	try {
		const res = await patchDataAPI(`order/${id}`, data);
		if (res.status === 200) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
};

const renderOrder = async () => {
	const tableList = $('#table')[0];

	const BuildPage = async () => {
		const { data } = await getDataAPI('order');
		const listOrder = data.data;

		const buildList = async (buildPagination, min, max) => {
			tableList.innerHTML =
				`<thead>
					<tr>
						<th class="col">Tên người dùng</th>
						<th class="col">Email</th>
						<th class="col">Tổng số tiền</th>
						<th class="col">Trạng thái</th>
						<th class="col"></th>
						<th class="col"></th>
					</tr>
				</thead>
				<tbody >` +
				listOrder
					.slice(min, max)
					.map((order) => {
						let price = 0;
						order.products.forEach((product) => {
							price += product.product.price * product.quantity;
						});
						return `
							<tr class="item-list" data-id=${order._id}>
								<td class="info">${order.name}</td>
								<td class="email">${order.email}</td>
								<td class="price">${formatter.format(price + 30000)}</td>
								<td class="status" value="${order.status}">${getStatus(order.status)}</td>
								<td class="show-info" data-bs-toggle="modal" data-bs-target="#showInfoModal">Chi tiết</td>
								
								<td class="col-lg-2 col-sm-2 col-4 col-action text-end">
									<div class="btn btn-sm font-sm rounded btn-brand" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil"></i>Cập nhật</div>
									<div class="btn btn-sm font-sm btn-light rounded btn btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash"></i>Xoá</div>
								</td>
							</tr>`;
					})
					.join('') +
				`</tbody>`;

			buildPagination(listOrder.length);
		};

		pagination(buildList);
	};

	//----------------------------------------

	// Delete order
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
			}
		};
	});

	//------------------------------

	// Update order
	$('#updateModal').on('show.bs.modal', function (e) {
		// get row
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');

		const statusValue = item.find('.status')[0].getAttribute('value');
		console.log(statusValue);

		// Set giá trị khi hiện modal update

		document.querySelector('#statusOrder').value = statusValue;
		const updateOrderButton = $('.btn-update-order')[0];

		updateOrderButton.setAttribute('update-id', itemId);
		updateOrderButton.onclick = async (e) => {
			const updateId = updateOrderButton.getAttribute('update-id');
			const status = document.querySelector('#statusOrder').value;

			const isSuccess = await updateOrder(updateId, { status });

			if (isSuccess) {
				$('#updateModal').modal('hide');
				BuildPage();
			}
		};
	});

	// Get info order
	$('#showInfoModal').on('shown.bs.modal', async function (e) {
		const item = $(e.relatedTarget).closest('.item-list');
		const itemId = item.attr('data-id');
		console.log(itemId);

		try {
			const res = await getDataAPI(`order/${itemId}`);
			const infoRender = document.querySelector('.body-info');
			let totalPrice = 0;
			const { products } = res.data.data;
			console.log(res);

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
			console.log(error);
		}
	});

	BuildPage();
};

export { renderOrder };
