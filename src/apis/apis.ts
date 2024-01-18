// import axios from "axios";
import { IAddDataProps } from "../components/Add";
import { ILoginProps } from "../pages/Login";
import { ISignupProps } from "../pages/Signup";
import { globalConfig } from "../utils/globals";
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

        globalConfig.isToken = accessToken;

        return true;
      } else {
        // 400 - Bad Request
        throw new Error("Login Failed");
      }
    })
    .catch((error) => {
      if (!error.response) {
        console.error("Server Disconnected");
        throw new Error("Server Disconnected");
      } else {
        // 에러 발생시 아이디가 틀렸다던가 존재하지 않는 아이디라던가... CONTROL
        console.error("Server Error:", error.response.status);
      }
      throw error;
    });
}

export async function postSignup(data: ISignupProps): Promise<boolean> {
  const url = `${process.env.REACT_APP_BASE_URL}api/members`;

  return tokenRefresher
    .post(url, data)
    .then((response) => {
      console.log(response.status);
      if (response.data.status === 201) {
        return true;
      } else {
        throw new Error("Signup Failed");
      }
    })
    .catch((error) => {
      if (!error.response) {
        console.error("Server Disconnected");
        throw new Error("Server Disconnected");
      } else {
        console.error("Server Error:", error?.response?.status ?? "");
        throw error;
      }
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

export async function deleteLogout() {
  const url = `${process.env.REACT_APP_BASE_URL}api/auth`;

  return tokenRefresher
    .delete(url)
    .then((response) => {
      if (response.data.status === 200) {
        return response;
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

  return tokenRefresher
    .post(url, {
      friendNickname,
    })
    .catch((error) => {
      if (!error.response) {
        console.error("Server Disconnected");
        throw new Error("Server Disconnected");
      } else {
        console.error("Server Error:", error.response.status);
      }
      throw error;
    });
}

export function getUserProfileData(memberNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/profiles/${memberNickname}`;

  return tokenRefresher.get(url);
}

export function deleteFriend(friendNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/friends`;

  return tokenRefresher.delete(url, {
    data: {
      friendNickname,
    },
  });
}

export async function postCreateChatroom(friendNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom`;

  return tokenRefresher
    .post(url, {
      friendNickname,
    })
    .catch((error) => {
      if (error.response?.status === 400) {
        throw new Error("이미 존재하는 채팅방 입니다.");
      }
      if (!error.response) {
        console.error("Server Disconnected");
        throw new Error("Server Disconnected");
      } else {
        console.error("Server Error:", error.response.status);
      }

      throw error;
    });
}

export function getChatroomLog(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/${channelId}/messages`;

  return tokenRefresher.get(url, {
    params: {
      channelId,
    },
  });
}

export function deleteChatRoom(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom`;

  return tokenRefresher.delete(url, {
    data: {
      channelId,
    },
  });
}

export function getFindFriend(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/${channelId}`;

  return tokenRefresher.get(url, {
    params: {
      channelId,
    },
  });
}

export function getAlertCounter(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/alerts/${channelId}`;

  return tokenRefresher.get(url);
}

export function getTotalAlertCounter() {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/alerts`;

  return tokenRefresher.get(url);
}
