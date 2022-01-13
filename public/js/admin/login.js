const { postDataAPI } = require('../util/fetchAPI');
const { toast } = require('../util/toastify');

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
