import { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import Hood from "../components/Hood";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import {
  getAlertCounter,
  getChatList,
  getTotalAlertCounter,
} from "../apis/apis";
import { IUserProps } from "./User";
import { globalConfig } from "../utils/globals";
import { useGlobalAlertCounter } from "../utils/notification";

export interface IChatListProps {
  chatroomChannelId: string;
  profileResponseList: IUserProps[];
  recentChat: IRecentProps;
  // counter: number;
}

export interface IRecentProps {
  message: string;
  regdate: string;
}

export interface IAlertProps {
  channelId: string;
  count: number;
}

export default function Chats() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isList, setIsList] = useState<IChatListProps[]>([]);
  const [isTotalCount, setIsTotalCount] = useState(useGlobalAlertCounter());
  const alertCounter = useGlobalAlertCounter();

  useEffect(() => {
    const getList = async () => {
      try {
        const chatListResponse = await getChatList();
        if (
          chatListResponse.status === 200 &&
          chatListResponse.data?.status === 200
        ) {
          let newChatList = chatListResponse.data.result;
          console.log(newChatList);
          newChatList.map(async (chat: IChatListProps) => {
            const channelId = chat.chatroomChannelId;
            const alertCounterResponse = await getAlertCounter(channelId);
            if (alertCounterResponse.status === 200) {
              const alertCounter = alertCounterResponse.data.result;
              console.log(alertCounter);
            }
          });

          setIsList(newChatList);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log(globalConfig.isAlertCounter);
    getList();
  }, [alertCounter]);

  useEffect(() => {
    const getBubble = async () => {
      try {
        const response = await getTotalAlertCounter();
        // console.log(response);
        if (response.status === 200 && response.data.status === 200) {
          setIsTotalCount(response.data.result);

          const chatListResponse = await getChatList();
          if (
            chatListResponse.status === 200 &&
            chatListResponse.data?.status === 200
          ) {
            setIsList(chatListResponse.data.result);
          }
        }
      } catch (error) {
      } finally {
      }
    };

    getBubble();
  }, [alertCounter]);

  return (
    <div className="flex flex-row">
      <Hood title="채팅 목록" />
      {/* Container */}
      <SideBar isTotalCount={isTotalCount} />
      <div className="ml-16 h-full flex w-full flex-col justify-start">
        <TopBar />
        {/* Body */}
        <div className="flex flex-col justify-start px-4 pt-4">
          {/* Detail Bar */}
          <div className="flex flex-row justify-between items-center">
            {/* title */}
            <h2 className="text-xl font-bold">채팅</h2>
            {/* utilities */}
            <div className="bg-transparent flex flex-row gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="mx-4">
          {isList.map((room) => (
            <ChatList
              key={room.chatroomChannelId}
              recentChat={room.recentChat}
              chatroomChannelId={room.chatroomChannelId}
              profileResponseList={room.profileResponseList}
              // counter={room.counter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
