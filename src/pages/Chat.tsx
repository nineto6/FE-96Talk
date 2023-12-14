import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Bubble from "../components/Bubble";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Hood from "../components/Hood";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { globalConfig } from "../utils/globals";
import SockJS from "sockjs-client";
import {
  deleteChatRoom,
  getChatList,
  getChatroomLog,
  getFindFriend,
  getProfileData,
  getProfileImage,
  postAddFriend,
} from "../apis/apis";
import { IUserProps } from "./User";
import ChatTopBar from "../components/ChatTopBar";
import Loading from "../components/Loading";
import SideTabBar from "../components/SideTabBar";
import Warning from "../components/Warning";
import Messenger from "../components/Messenger";

interface IChatProps {
  channelId: string;
  message: string;
  regdate: string;
  writerNickname: string;
}

interface IChatroomProps {
  chatroomChannelId: string;
  profileResponseList: IUserProps[];
}

interface IMessageProps {}

export default function Chat() {
  const [isName, setIsName] = useState<string>("");
  const [isChat, setIsChat] = useState<IChatProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPartner, setIsPartner] = useState<IUserProps[]>([
    {
      memberNickname: "",
      imageName: null,
      profileStateMessage: "",
      type: null,
    },
  ]);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { chatroomChannelId } = useParams();
  const nav = useNavigate();
  const [isTab, setIsTab] = useState<boolean>(false);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);
  const [isErrorText, setIsErrorText] = useState("");
  const [isMessage, setIsMessage] = useState(false);
  const [isMessageText, setIsMessageText] = useState("");

  let client = useRef<CompatClient>();

  const onValid = (data: { message: string }) => {
    publish(data.message);
    reset();
  };

  const onTab = () => {
    setIsTab((current) => !current);
  };

  const moveBack = () => {
    nav(-1);
  };

  const deleteRoom = async () => {
    try {
      setIsLoading(true);
      if (chatroomChannelId) {
        const response = await deleteChatRoom(chatroomChannelId);
        console.log(response);

        nav("/chats");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectHandler = async () => {
    const token = globalConfig.isToken;

    client.current = Stomp.over(() => {
      const sock = new SockJS(`https://nineto6.p-e.kr/api/ws`);
      return sock;
    });

    client.current.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        client.current?.subscribe(
          `/sub/chat/${chatroomChannelId}`,
          (body) => {
            // console.log(JSON.parse(body.body));
            setIsChat((current) => {
              return [...current, JSON.parse(body.body)];
            });
          },
          { Authorization: `Bearer ${token}` }
        );
      },
      () => {
        // error 로직
        // alert("error");
        nav("/");
      }
    );

    client.current.onStompError = (frame) => {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };
  };

  const publish = (chat: string) => {
    const token = globalConfig.isToken;

    client.current?.publish({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      destination: "/pub/chat",
      body: JSON.stringify({
        channelId: chatroomChannelId,
        message: chat,
        writerNickname: isName,
      }),
    });
  };

  const addFriend = async () => {
    const partner = isPartner[0].memberNickname;
    try {
      await postAddFriend(partner).then((response) => {
        console.log(response);
        if (response.status === 201 && response.data?.status === 201) {
          // console.log("등록 성공");
          setIsMessage(true);
          setIsMessageText("친구 등록에 성공하였습니다.");
          setIsWarning(false);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setIsError(true);
        setIsErrorText(error.message);
      }
    } finally {
    }
  };

  useEffect(() => {
    const connection = async () => {
      await getProfileData().then((response) => {
        if (response.status === 200 && response.data?.status === 200) {
          // console.log(response);
          setIsName(response.data.result.memberNickname);
          connectHandler();
        }
      });

      await getChatList()
        .then((response: any) => {
          // console.log(response);
          if (response.status === 200 && response.data?.status === 200) {
            response.data.result.map(async (chatroom: IChatroomProps) => {
              if (chatroom.chatroomChannelId === chatroomChannelId) {
                // 일치하는 방을 찾았을 경우
                try {
                  setIsPartner(chatroom.profileResponseList);
                  await getChatroomLog(chatroom.chatroomChannelId).then(
                    (response) => {
                      if (
                        response.status === 200 &&
                        response.data?.status === 200
                      ) {
                        // console.log(response);
                        setIsChat(response.data.result);
                      }
                    }
                  );

                  await getFindFriend(chatroom.chatroomChannelId).then(
                    (response) => {
                      console.log(response);

                      if (response.status === 200 && response.data?.status) {
                        if (
                          response.data.result.includes(
                            chatroom.profileResponseList[0].memberNickname
                          )
                        ) {
                          setIsWarning(true);
                        }
                      }
                    }
                  );
                } catch (error) {
                  console.error(error);
                } finally {
                }
              }
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    connection();

    return () => {
      if (client.current) {
        client.current.unsubscribe(`/sub/chat/${chatroomChannelId}`);
      }
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        behavior: "auto",
      });
    }
  }, [isChat]);

  return (
    <div className="min-h-screen flex w-full flex-col justify-start">
      {isLoading && <Loading />}
      {isError && <Messenger text={isErrorText} setIsError={setIsError} />}
      {isTab && <SideTabBar setIsTab={setIsTab} deleteChatRoom={deleteRoom} />}
      {isMessage && (
        <Messenger text={isMessageText} setIsError={setIsMessage} />
      )}
      <Hood
        title={`${isPartner.map(
          (partner) => partner.memberNickname
        )} 님과의 채팅`}
      />
      <div className="relative  z-20">
        {/* other-user */}

        <div className="px-8 fixed w-full bg-white border-b transition-colors h-auto flex flex-row justify-between items-stretch pt-2 pb-2">
          {/* <TopBar /> */}

          <ChatTopBar isPartner={isPartner} setIsLoading={setIsLoading} />
          <div className="flex flex-row gap-4">
            <div
              className="flex flex-col justify-center items-center"
              onClick={moveBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </div>
            <div className="flex justify-center items-center" onClick={onTab}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {isWarning && <Warning addFriend={addFriend} />}
        </div>
      </div>
      <div className="bg-white  custom-max-h pt-20 pb-4">
        {isChat.map((bubble, index) => (
          <Bubble
            key={index}
            text={bubble.message}
            time={bubble.regdate}
            speaker={bubble.writerNickname === isName ? true : false}
          />
        ))}
      </div>

      <div
        ref={chatRef}
        className="w-full h-24 bg-themePurple flex flex-col justify-center items-center"
      >
        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full md:w-2/3 px-16 flex flex-row"
        >
          <input
            {...register("message", {
              required: "채팅 내용을 입력하세요.",
            })}
            type="text"
            id="message"
            name="message"
            className="w-full px-8 rounded-l-2xl focus:ring-0 outline-none "
            autoComplete="off"
          />
          <button className="bg-themeDarkPurple text-slate-700 focus:ring-0 outline-none p-3 rounded-r-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
