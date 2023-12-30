import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteLogout,
  getAlertCounter,
  getChatList,
  getTotalAlertCounter,
} from "../apis/apis";
import Loading from "./Loading";
import { stompClient } from "../utils/globals";
import {
  requestNotification,
  useGlobalAlertCounter,
} from "../utils/notification";
import { IChatListProps } from "../pages/Chats";
import { isMobile } from "react-device-detect";

interface IBubbleProps {
  channelId: string;
  count: number;
}

interface ISideBarProps {
  isTotalCount: number;
}

export default function SideBar({ isTotalCount }: ISideBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(!isMobile && Notification.permission);
  const alertCounter = useGlobalAlertCounter();

  const nav = useNavigate();
  const location = useLocation();
  let [isState, setIsState] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    setIsState(location.pathname.split("/")[1]);
  }, [location]);

  // useEffect(() => {
  //   const getCounter = async () => {
  //     try {
  //       const alertCounterResponse = await getAlertCounter();
  //       if (alertCounterResponse.status === 200) {
  //         const alertCounterList =
  //           alertCounterResponse.data.result.alertChatList;
  //         let total = 0;
  //         alertCounterList.map((chat: IBubbleProps) => {
  //           // setIsCounter();
  //           total += chat.count;
  //         });

  //         setIsCounter(total);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //     }
  //   };

  //   getCounter();
  // }, [alertCounter]);

  // const onAlert = () => {
  //   if (!isMobile) {
  //     requestNotification().then((permission) => {
  //       console.log(`알림 권한 상태: ${permission}`);
  //       setIsAlert(permission);
  //     });
  //   }
  // };

  const onLogout = async () => {
    try {
      setIsLoading(true);
      const request = await deleteLogout();
      console.log(request);

      if (request) {
        // 정상적으로 제거 되면
        // Cookies.remove("RT");
        stompClient.instance?.unsubscribe(`/sub/alert/${request.data.result}`);
        stompClient.instance?.disconnect();
        stompClient.instance = null;
        stompClient.isConnect = false;
      }
    } catch (error) {
      // console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
      nav("/login");
    }
  };

  const onMove = (target: React.MouseEvent<SVGElement>) => {
    // console.log(target.currentTarget.id);
    const dest = target.currentTarget.id;

    dest === "friend" ? nav("/") : nav(`/${dest}`);
  };

  useEffect(() => {
    const getTotalCounter = async () => {
      const response = await getTotalAlertCounter();
      console.log(response);
    };

    getTotalCounter();
  }, [alertCounter]);

  return (
    <div className="fixed w-16 h-full min-h-full flex flex-col bg-themePurple text-themeDarkPurple pt-9 justify-start items-center gap-12">
      {isLoading && <Loading />}
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 cursor-pointer hover:text-white transition-colors ${
            isState === "" ? "text-white" : ""
          }`}
          id="friend"
          onClick={onMove}
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="relative">
        <div
          className={`text-slate-50 absolute -top-4 -right-2 text-xs bg-red-400 py-1 px-2 min-w-[12px] min-h-[12px] rounded-full flex flex-col justify-center items-center ${
            isTotalCount === 0 && "hidden"
          }`}
        >
          <h2>{100 < isTotalCount ? `99+` : isTotalCount}</h2>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 cursor-pointer hover:text-white transition-colors 
        ${isState === "chats" ? "text-white" : ""}
        `}
          id="chats"
          onClick={onMove}
        >
          <path
            fillRule="evenodd"
            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 cursor-pointer hover:text-white transition-colors  ${
            isState === "profile" ? "text-white" : ""
          }`}
          id="profile"
          onClick={onMove}
        >
          <path
            fillRule="evenodd"
            d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer hover:text-white transition-colors"
          onClick={onLogout}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </div>

      {isAlert === "denied" ? (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.57 16.476c-.223.082-.448.161-.674.238L7.319 4.137A6.75 6.75 0 0118.75 9v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206z" />
            <path
              fillRule="evenodd"
              d="M5.25 9c0-.184.007-.366.022-.546l10.384 10.384a3.751 3.751 0 01-7.396-1.119 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
            <path
              fillRule="evenodd"
              d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
