// import axios from "axios";
import axios from "axios";
import { IAddDataProps } from "../components/Add";
import { ILoginProps } from "../pages/Login";
import { ISignupProps } from "../pages/Signup";
import { globalConfig } from "../utils/globals";
import tokenRefresher from "./refresh";

/**
 * 기존 access-token 을 default.headers.common 으로
 * 담아서 숨김
 *
 * @param data 로그인 데이터
 * @returns tokenRefresher
 */
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

/**
 * 회원가입 성공 시 response.data.status 201
 * @param data 회원가입 데이터
 * @returns tokenRefresher
 */
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

/**
 * 프로필 데이터를 가져오는 api 함수
 * @returns tokenRefresher
 */
export async function getProfileData() {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;

  return tokenRefresher.get(url);
}

/**
 * headers 의 Accept 에 타입을 담음
 *
 * response-type 을 "blob" 으로 정해 응답 받아야 함
 *
 * @param imageName image 의 이름
 * @param type 이미지 타입
 * @returns tokenRefresher
 */
export function getProfileImage(imageName: string, type: string) {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles/images/${imageName}`;

  return tokenRefresher.get(url, {
    headers: {
      Accept: `${type}`,
    },
    responseType: "blob", // 중요: 응답을 Blob으로 받음
  });
}

/**
 * form-data 에는 Image 로 프로필 이미지도 함께 담겨 있기 때문에
 *
 * headers "Content-Type" 에 multipart/form-data 를 담아주어야 함
 *
 * @param formData 새로 수정할 form-data
 * @returns tokenRefresher
 */
export async function patchProfileData(formData: FormData) {
  let url = `${process.env.REACT_APP_BASE_URL}api/profiles`;
  return tokenRefresher.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 로그아웃 API 함수
 * @returns tokenRefresher
 */
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

/**
 * 친구목록 리스트 API 함수
 * @returns tokenRefresher
 */
export async function getFriendList() {
  const url = `${process.env.REACT_APP_BASE_URL}api/friends`;
  return tokenRefresher.get(url);
}

/**
 * 채팅리스트 API 함수
 * @returns tokenRefresher
 */
export function getChatList() {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom`;
  return tokenRefresher.get(url);
}

/**
 *
 * @param data 친구 추가시 친구 정보
 * @returns tokenRefresher
 */
export function getSearchProfileList(data: IAddDataProps) {
  const url = `${process.env.REACT_APP_BASE_URL}api/profiles/search`;

  return tokenRefresher.get(url, {
    params: data,
  });
}

/**
 *
 * @param friendNickname 친구추가 시 친구의 닉네임
 * @returns tokenRefresher
 */
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

/**
 * 특정 유저의 프로필 정보를 가져올 때
 * @param memberNickname 해당 유저의 닉네임
 * @returns tokenRefresher
 */
export function getUserProfileData(memberNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/profiles/${memberNickname}`;

  return tokenRefresher.get(url);
}

/**
 * 친구 삭제 API 함수
 * @param friendNickname 삭제할 해당 친구 닉네임
 * @returns tokenRefresher
 */
export function deleteFriend(friendNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/friends`;

  return tokenRefresher.delete(url, {
    data: {
      friendNickname,
    },
  });
}

/**
 * 채팅방 생성 API 함수
 * @param friendNickname 채팅방을 생성할 친구 닉네임
 * @returns tokenRefresher
 */
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

/**
 * 특정 채팅방의 채팅 로그를 가져오는 함수
 * @param channelId 채팅방의 고유 ID 값
 * @returns tokenRefresher
 */
export function getChatroomLog(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/${channelId}/messages`;

  return tokenRefresher.get(url, {
    params: {
      channelId,
    },
  });
}

/**
 * 채팅방 삭제 API 함수
 * @param channelId 삭제할 채팅방의 고유 아이디
 * @returns tokenRefresher
 */
export function deleteChatRoom(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom`;

  return tokenRefresher.delete(url, {
    data: {
      channelId,
    },
  });
}

/**
 * 채팅방에서 해당 친구를 찾기 위한 함수
 * @param channelId 채팅방의 고유 ID
 * @returns tokenRefresher
 */
export function getFindFriend(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/${channelId}`;

  return tokenRefresher.get(url, {
    params: {
      channelId,
    },
  });
}

/**
 * 각 개인방의 알람을 가져오는 함수
 * @param channelId 채팅방의 고유 아이디
 * @returns tokenRefresher
 */
export function getAlertCounter(channelId: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/alerts/${channelId}`;

  return tokenRefresher.get(url);
}

/**
 * 총 알람 수를 가져오는 함수
 * @returns tokenRefresher
 */
export function getTotalAlertCounter() {
  const url = `${process.env.REACT_APP_BASE_URL}api/chatroom/alerts`;

  return tokenRefresher.get(url);
}

/**
 * 이메일 중복확인 API 함수
 *
 * 로그인 하기 전 회원가입의 API 이므로 axios 로 return
 * @param memberEmail 중복확인 하기 위한 타겟 이메일
 * @returns axios
 */
export function getDuplicateEmail(memberEmail: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/members/check-email`;

  return axios.get(url, {
    params: {
      memberEmail,
    },
  });
}

/**
 * 닉네임 중복확인 API 함수
 *
 * 로그인 하기 전 회원가입의 API 이므로 axios 로 return
 * @param memberNickname 중복확인 하기 위한 타겟 닉네임
 * @returns axios
 */
export function getDuplicateNickname(memberNickname: string) {
  const url = `${process.env.REACT_APP_BASE_URL}api/members/check-nickname`;

  return axios.get(url, {
    params: {
      memberNickname,
    },
  });
}
