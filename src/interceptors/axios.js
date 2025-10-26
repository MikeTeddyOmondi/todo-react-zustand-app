import axios from "axios";

axios.defaults.baseURL = "http://localhost:8888/api/v1";

// Load token from localStorage on initialization
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

let pageRefreshed = false;

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401 && !pageRefreshed) {
      pageRefreshed = true;

      const response = await axios.post("refresh", {}, { withCredentials: true });
      // console.log(response.data);

      if (response.status === 200) {
        const newToken = response.data.data["token"];
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        localStorage.setItem("token", newToken);

        return axios(error.config);
      }
    }
    pageRefreshed = false;
    return error;
  }
);
