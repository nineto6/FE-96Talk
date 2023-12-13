import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import Hood from "../components/Hood";
import TopBar from "../components/TopBar";
import { useEffect, useState } from "react";
import {
  deleteFriend,
  getChatList,
  getFriendList,
  getProfileImage,
  getUserProfileData,
  postAddFriend,
  postCreateChatroom,
} from "../apis/apis";
import Loading from "../components/Loading";
import Messenger from "../components/Messenger";

export interface IUserProps {
  memberNickname: string;
  imageName: string | null;
  profileStateMessage: string;
  type: string | null;
}

export default function User() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<string>("");
  const [isData, setIsData] = useState<IUserProps>({
    memberNickname: "",
    imageName: null,
    profileStateMessage: "",
    type: null,
  });

  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isErrorText, setIsErrorText] = useState("");
  const { userNumber } = useParams();
  const nav = useNavigate();

  const onChat = async () => {
    try {
      setIsLoading(true);
      if (userNumber) {
        const response = await postCreateChatroom(userNumber);
        if (response.data.result) {
          if (response.data?.status === 201 || response.data.status) {
            nav(`/chats/${response.data.result}`);
          }
        }

        // nav(`/chats/${userNumber}`);
      }
    } catch (error) {
      // console.log("Cannot create chatroom");
      if (error instanceof Error) {
        setIsError(true);
        setIsErrorText(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onAdd = async () => {
    // ADD FRIEND LOGIC 추후 추가
    try {
      setIsLoading(true);
      if (userNumber) {
        const response = await postAddFriend(userNumber);
        console.log("Add friend");
      }
    } catch (error) {
      console.log("Cannot add friend");
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      if (userNumber) {
        const response = await deleteFriend(userNumber);
        console.log("Delete friend");
      }
    } catch (error) {
      console.log("Cannot delete friend");
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const getData = async () => {
      if (userNumber) {
        try {
          const userProfilePromise = getUserProfileData(userNumber);
          const friendListPromise = getFriendList();

          const [userProfileResponse, friendListResponse] = await Promise.all([
            userProfilePromise,
            friendListPromise,
          ]);

          if (userProfileResponse?.data?.status === 200) {
            const { imageName, memberNickname, profileStateMessage, type } =
              userProfileResponse.data.result;

            setIsData(() => {
              return {
                imageName,
                memberNickname,
                profileStateMessage,
                type,
              };
            });

            const list = friendListResponse.data.result.friendProfileList;
            list.forEach((friend: IUserProps) => {
              if (friend.memberNickname === userNumber) {
                setIsFriend(true);
              }
            });

            if (imageName && type) {
              try {
                const imageResponse = await getProfileImage(imageName, type);
                const reader = new FileReader();
                reader.readAsDataURL(imageResponse.data);
                reader.onloadend = () => {
                  const base64data = reader.result as string;
                  setIsImage(base64data);
                };
              } catch (error) {
                console.log("Not exist image.");
                console.error(error);
              }
            }
          }
        } catch (error) {
          console.log("Unregistered user.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getData();
  }, [userNumber]);

  return (
    <div className="flex justify-center items-center bg-violet-200">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isError && <Messenger text={isErrorText} setIsError={setIsError} />}
          <Hood title={`${isData.memberNickname}님의 프로필`} />
          <div className="bg-white flex flex-col justify-start h-screen">
            <TopBar />

            <div className="mx-4 mt-24">
              <div className="py-8 flex flex-col justify-center items-center">
                {/* profile info */}
                {/* profile image */}

                <div className="mt-4">
                  <div className="flex flex-col w-72 gap-2">
                    <div className="flex flex-col justify-center items-center mb-12">
                      <span
                        className="w-32 h-32 bg-violet-400 rounded-full relative"
                        style={{
                          backgroundImage: `url(${isImage})`,
                          backgroundSize: "cover", // 이미지를 span 크기에 맞게 조절
                          backgroundPosition: "center", // 이미지를 중앙에 위치시킴
                        }}
                      >
                        {/* 파일 담는 input, hidden 시키고 label 을 누를 때 동작하도록 함 */}
                      </span>
                    </div>
                    <div className="border-b-2 relative">
                      <div className="px-8 h-8 bg-transparent text-center w-full focus:outline-none text-slate-800">
                        <h3>{isData.memberNickname}</h3>
                      </div>
                    </div>
                    <div className="border-b-2 relative">
                      <div className="px-8 h-8 bg-transparent text-center w-full focus:outline-none text-slate-800">
                        <h3>{isData.profileStateMessage}</h3>
                      </div>
                    </div>
                    {/* <input className="h-8 border-b-2 bg-transparent" /> */}
                    <div className="mt-12 flex flex-row justify-around items-center text-violet-400 text-sm">
                      <div
                        onClick={onChat}
                        className="transition-colors flex flex-col justify-between items-center cursor-pointer p-2 hover:bg-slate-100 rounded-xl gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3 className="text-slate-700">채팅 하기</h3>
                      </div>

                      {isFriend ? (
                        <div
                          onClick={onDelete}
                          className="gap-2 transition-colors flex flex-col justify-between items-center cursor-pointer p-2 hover:bg-slate-100 rounded-xl"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M10.375 2.25a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM10.375 12a7.125 7.125 0 00-7.124 7.247.75.75 0 00.363.63 13.067 13.067 0 006.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 00.364-.63l.001-.12v-.002A7.125 7.125 0 0010.375 12zM16 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" />
                          </svg>

                          <h3 className="text-slate-700">친구 삭제</h3>
                        </div>
                      ) : (
                        <div
                          onClick={onAdd}
                          className="gap-2 transition-colors flex flex-col justify-between items-center cursor-pointer p-2 hover:bg-slate-100 rounded-xl"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                          </svg>

                          <h3 className="text-slate-700">친구 추가</h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
