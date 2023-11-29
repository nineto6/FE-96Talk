import axios from "axios";
import { Interface } from "readline";
import { ILoginProps } from "../pages/Login";
import { ISignupProps } from "../pages/Signup";

export async function postLogin(data: ILoginProps): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/auth/login`;

  return axios.post(url, data).then((response) => {
    // console.log(response);
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

export async function postSignup(data: ISignupProps): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/members`;

  return axios.post(url, data).then((response) => {
    if (response.data.status === 201) {
      //   console.log(response.data.message);
      return true;
    } else {
      throw new Error("회원가입 실패");
    }
  });
}

export async function getProfileData() {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;
  let accessToken = sessionStorage.getItem("accessToken");

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProfileImage(imageName: string, type: string) {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles/images/${imageName}`;
  let accessToken = sessionStorage.getItem("accessToken");

  return axios.get(url, {
    headers: {
      Accept: `${type}`,
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "blob", // 중요: 응답을 Blob으로 받음
  });
}

export async function patchProfileData(formData: FormData) {
  let token = sessionStorage.getItem("accessToken");

  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;
  return axios.patch(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteLogout(): Promise<boolean> {
  let isToken = sessionStorage.getItem("accessToken");
  const url = `${process.env.REACT_APP_BASE_URL}api/auth`;

  return axios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data.status === 200) {
        return true;
      } else {
        throw new Error("로그아웃 실패");
        // console.log(response.data.message);
      }
    });
}

export function getFriendList(data: any, url: string) {}

export function getChatList(data: any, url: string) {}
