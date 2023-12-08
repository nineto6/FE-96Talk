// import axios from "axios";
import { IAddDataProps } from "../components/Add";
import { ILoginProps } from "../pages/Login";
import { ISignupProps } from "../pages/Signup";
import tokenRefresher from "./refresh";

export async function postLogin(data: ILoginProps): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/auth/login`;

  return tokenRefresher
    .post(url, data)
    .then((response) => {
      if (response.data.status === 200) {
        // 200 - login success
        const accessToken = response.data.result["AT"];
        tokenRefresher.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return true;
      } else {
        // 400 - Bad Request
        throw new Error("Login Failed");
      }
    })
    .catch((error) => {
      if (!error.message) {
        throw new Error("Server Disconnected");
      }
      throw error;
    });
}

export async function postSignup(data: ISignupProps): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/members`;

  return tokenRefresher
    .post(url, data)
    .then((response) => {
      if (response.data.status === 201) {
        return true;
      } else {
        throw new Error("Signup Failed");
      }
    })
    .catch((error) => {
      if (!error.message) {
        throw new Error("Server Disconnected");
      }
      throw error;
    });
}

export async function getProfileData() {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;

  return tokenRefresher.get(url);
}

export function getProfileImage(imageName: string, type: string) {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles/images/${imageName}`;

  return tokenRefresher.get(url, {
    headers: {
      Accept: `${type}`,
    },
    responseType: "blob", // 중요: 응답을 Blob으로 받음
  });
}

export async function patchProfileData(formData: FormData) {
  // let token = sessionStorage.getItem("accessToken");

  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;
  return tokenRefresher.patch(url, formData, {
    headers: {
      // Authorization: `Bearer ${token}`,  // common-test accessToken masking 2023.11.29
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteLogout(): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/auth`;

  return tokenRefresher
    .delete(url)
    .then((response) => {
      if (response.data.status === 200) {
        return true;
      } else {
        throw new Error("Logout Failed");
      }
    })
    .catch((error) => {
      if (!error.message) {
        throw new Error("Server Disconnected");
      }
      throw error;
    });
}

export async function getFriendList() {
  const url = `${process.env.REACT_APP_BASE_URL}api/friends`;
  return tokenRefresher.get(url);
}

export function getChatList() {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom`;
  return tokenRefresher.get(url);
}

export function getSearchProfileList(data: IAddDataProps) {
  const url = `${process.env.REACT_APP_BASE_URL}api/profiles/search`;

  return tokenRefresher.get(url, {
    params: data,
  });
}

export function postAddFriend(friendNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/friends`;

  return tokenRefresher.post(url, {
    friendNickname,
  });
}

export function getUserProfileData(memberNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/profiles/${memberNickname}`;

  return tokenRefresher.get(url);
}
