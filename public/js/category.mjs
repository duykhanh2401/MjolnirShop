const createCategory = async (name) => {
	try {
		const res = await axios.post('http://localhost:8000/api/v1/category', {
			name,
		});
		// if (res.data.status === 'success') {
		// 	location.reload();
		// }
		alert(name);
	} catch (error) {
		console.log('error');
	}
};

export { createCategory };
