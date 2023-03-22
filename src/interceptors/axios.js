import axios from "axios";

axios.defaults.baseURL = "http://localhost:8888/api/v1";

let pageRefreshed = false;

axios.interceptors.response.use(
	(res) => res,
	async (error) => {
		if (error.response.status === 401 && !pageRefreshed) {
			pageRefreshed = true;

			const response = await axios.post(
				"refresh",
				{},
				{ withCredentials: true },
			);
			// console.log(response.data);

			if (response.status === 200) {
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${response.data.data["token"]}`;

				return axios(error.config);
			}
		}
		pageRefreshed = false;
		return error;
	},
);
