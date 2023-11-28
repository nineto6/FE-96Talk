import axios from "axios";
import { Interface } from "readline";
import { ILoginProps } from "../pages/Login";
import { ISignupProps } from "../pages/Signup";

const BASE_URL = "http://nineto6.kro.kr:8080/";

export function postLogin(data: ILoginProps): Promise<boolean> {
  const url = `${BASE_URL}api/auth/login`;

  return axios.post(url, data).then((response) => {
    console.log(response);
    if (response.data.status === 200) {
      // 200 - login success
      sessionStorage.setItem("accessToken", response.data.result["AT"]);
      return true;
    } else {
      // 400 - Bad Request
      throw new Error("로그인 실패");
    }
  });
}

export function postSignup(data: ISignupProps): Promise<boolean> {
  const url = `${BASE_URL}api/members`;

  return axios.post(url, data).then((response) => {
    if (response.data.status === 201) {
      //   console.log(response.data.message);

      return true;
    } else {
      throw new Error("회원가입 실패");
    }
  });
}

export function getProfileData(data: any, url: string) {}

export function getProfileImage(data: any, url: string) {}

export function getFriendList(data: any, url: string) {}

export function getChatList(data: any, url: string) {}
