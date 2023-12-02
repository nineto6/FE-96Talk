import axios from "axios";
import Cookies from "js-cookie";

////////////////////////////////////////////////////
//
//    TOKEN REFRESHER
//
////////////////////////////////////////////////////

export async function getAccessToken() {
  const url = `${process.env.REACT_APP_BASE_URL}api/auth`;

  return axios.put(url);
}

const tokenRefresher = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});
// axios instance 로 관리하기

tokenRefresher.interceptors.request.use(
  function (config) {
    console.log("Request");
    return config;
  },
  function (error) {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

tokenRefresher.interceptors.response.use(
  async function (response) {
    console.log("Response");
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // 요청 실패한 configuration 저장
    // console.log(error);
    // error.response.status (FUNCTION CHANGE)
    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const retry = await getAccessToken();

        const newAccessToken = retry.data.result["AT"];
        tokenRefresher.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("Refresh Success");

        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default tokenRefresher;
