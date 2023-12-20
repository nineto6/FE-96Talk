import { useNavigate } from "react-router-dom";
import { IChatListProps } from "../pages/Chats";
import { useEffect, useState } from "react";
import { getAlertCounter, getProfileImage } from "../apis/apis";
import dateFormatter from "../utils/formatter";
import { globalConfig } from "../utils/globals";
import { useGlobalAlertCounter } from "../utils/notification";

export default function FriendList({
  chatroomChannelId,
  profileResponseList,
  recentChat,
}: // counter,
IChatListProps) {
  const nav = useNavigate();
  const [isImage, setIsImage] = useState<string>("");
  const [isTime, setIsTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCounter, setIsCounter] = useState<number>(0);
  const alertCounter = useGlobalAlertCounter();

  const onMove = () => {
    nav(`${chatroomChannelId}`);
  };

  useEffect(() => {
    const getImage = async () => {
      if (profileResponseList[0].imageName && profileResponseList[0].type) {
        try {
          setIsLoading(true);
          const imageResponse = await getProfileImage(
            profileResponseList[0].imageName,
            profileResponseList[0].type
          );
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setIsImage(base64data);
          };
        } finally {
          setIsLoading(false);
        }
      }
    };

    const getCounter = async () => {
      try {
        const alertCounterResponse = await getAlertCounter(chatroomChannelId);
        if (alertCounterResponse.status === 200) {
          const alertCounter = alertCounterResponse.data.result;
          // console.log(alertCounter);
          setIsCounter(alertCounter);
        }
      } catch (error) {
      } finally {
      }
    };

    if (recentChat) {
      dateFormatter(recentChat.regdate, setIsTime);
    }
    getImage();
    getCounter();
  }, [alertCounter]);

  return (
    <div
      onClick={onMove}
      className="hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-b border-slate-300"
    >
      <div className="flex flex-row justify-between w-auto gap-4">
        <div
          className="h-14 w-14 bg-violet-200 rounded-3xl"
          style={{
            backgroundImage: `url(${isImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="flex flex-col justify-around">
          <div className="flex flex-row gap-2">
            {profileResponseList.map((member, index) => (
              <b key={index} className="text-slate-700 text-md">
                {member.memberNickname}
              </b>
            ))}
          </div>
          <p className="text-slate-500 text-sm">{recentChat?.message || ""}</p>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-between items-center">
        <p className="py-1 px-4 text-slate-500 text-xs">{isTime || ""}</p>
        <div
          className={`text-slate-50 bg-red-400 px-2 min-w-[24px] min-h-[24px] rounded-full flex flex-col justify-center items-center ${
            isCounter === 0 && "hidden"
          }`}
        >
          <h2>{isCounter}</h2>
        </div>
      </div>
    </div>
  );
}
