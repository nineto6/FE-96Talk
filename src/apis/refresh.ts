import axios from "axios";
import Cookies from "js-cookie";

////////////////////////////////////////////////////
//
//    TOKEN REFRESHER
//
////////////////////////////////////////////////////

const tokenRefresher = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});
// axios instance 로 관리하기

tokenRefresher.interceptors.request.use(
  function (config) {
    console.log(config);
    // const token = sessionStorage.getItem("accessToken");
    // // accessToken 을 관리할 때 물어보기
    // if (!token) {
    //   // 요청에 토큰이 없을 때
    //   config.headers["access-token"] = null;
    //   config.headers["refresh-token"] = null;

    //   console.log("Token is empty.");
    //   return config;
    // } else {
    //   const accessToken = sessionStorage.getItem("accessToken");
    //   // const refreshToken = localStorage.getItem("refreshToken");

    //   config.headers["Authorization"] = `Bearer ${accessToken}`;
    //   console.log(`Request Start : ${config.headers.Authorization}`);
    //   return config;
    // }

    return config;
  },
  function (error) {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

tokenRefresher.interceptors.response.use(async function (response) {
  // console.log("get response", response);
  // if (response.data.status === 401) {
  //   // token 에 문제가 생겼을 경우 401
  //   // token 문제 중 기간이 만료되었을 시
  //   const originalRequest = response.config;
  //   console.log("config", originalRequest);
  //   // 기존 요청 값을 변수로 저장

  //   const refreshToken = Cookies.get("RT");
  //   console.log("refreshToken", refreshToken);

  //   const refRes = await axios.get(
  //     `${process.env.REACT_APP_BASE_URL}api/auth`,
  //     {
  //       headers: { Authorization: `Bearer ${refreshToken}` },
  //     }
  //   );
  //   //refresh-response refresh-token 값을 headers 에 다시 담아서 재요청

  //   console.log("refRes :", refRes);

  //   const newAccessToken = refRes.headers["AT"];
  //   const newRefreshToken = refRes.headers["RT"];

  //   localStorage.setItem("accessToken", newAccessToken);
  //   Cookies.set("RT", newRefreshToken);
  //   // 새로 받아온 access-token 과 refreshtoken 을 다시 localStorage에 담음

  //   originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
  //   return axios(originalRequest);
  //   // 기존의 요청 header.authorization 에 newAccessToken 을 담아 axios 요청
  // }

  console.log(response);
  return response;
});

export default tokenRefresher;
