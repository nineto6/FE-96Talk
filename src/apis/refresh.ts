import axios from "axios";
import { globalConfig } from "../utils/globals";
import initialStomp from "../utils/initialStomp";
import { getProfileData } from "./apis";

export const refreshToken = async (callback: any) => {
  await axios
    .post(`${process.env.REACT_APP_BASE_URL}api/auth`)
    .then((response) => {
      const JWT_EXPIRE_TIME = 1800 * 1000; // 만료 시간 30분 (밀리 초로 표현)
      const accessToken = response.data.result["AT"];
      tokenRefresher.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      globalConfig.isToken = accessToken;
      console.log("res.data.accessToken : " + accessToken);

      if (callback) {
        // 최초 App 렌더시에 적용
        // 이후 setTimeOut 으로 재발급시 적용 X
        const connection = async () => {
          await getProfileData()
            .then((response: any) => {
              if (response.status === 200 && response.data?.status === 200) {
                const { memberNickname } = response.data.result;
                initialStomp(memberNickname);

                callback(true);
              }
            })
            .catch((error: any) => {
              console.error("Do not Websocket" + error);

              callback(false);
            });
        };

        connection();
      }

      setTimeout(function () {
        refreshToken(null);
      }, JWT_EXPIRE_TIME - 60000); // 만료 시간 1분 전에 재발급
    })
    .catch((error) => {
      console.log("app silent requset fail : " + error);
      if (callback) {
        callback(false);
      }
    })
    .finally(() => {
      console.log("refresh token request end");
    });
};

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
    console.log("Response Error");

    // 401 에러 발생 시 "/" 이동
    if (error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default tokenRefresher;
