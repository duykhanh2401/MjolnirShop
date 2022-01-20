export const getDataAPI = async (url) => {
	const res = await axios.get(`http://localhost:8000/api/v1/${url}`);
	return res;
};

export const postDataAPI = async (url, data) => {
	const res = await axios.post(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

export const patchDataAPI = async (url, data) => {
	const res = await axios.patch(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

export const putDataAPI = async (url, data) => {
	const res = await axios.put(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};

export const deleteDataAPI = async (url, data) => {
	const res = await axios.delete(`http://localhost:8000/api/v1/${url}`, data);
	return res;
};
