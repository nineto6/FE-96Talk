import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IFriendProps } from "../pages/Main";
import { getProfileImage } from "../apis/apis";
import Loading from "./Loading";

export default function FriendList({
  imageName,
  memberNickname,
  profileStateMessage,
  music,
  type,
}: IFriendProps) {
  const nav = useNavigate();
  const [isImage, setIsImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onMove = () => {
    nav(`user/${memberNickname}`);
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        if (imageName && type) {
          const imageResponse = await getProfileImage(imageName, type);
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setIsImage(base64data);
          };
        }
      } finally {
        setIsLoading(false);
      }
    };

    getImage();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div
        onClick={onMove}
        className={`
        hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-b border-slate-300`}
      >
        <div className="flex flex-row justify-between w-auto gap-4">
          <div
            className="h-14 w-14 bg-violet-200 rounded-3xl"
            style={{
              backgroundImage: `url(${isImage})`,
              backgroundSize: "cover", // 이미지를 span 크기에 맞게 조절
              backgroundPosition: "center", // 이미지를 중앙에 위치시킴
            }}
          />
          <div className="flex flex-col justify-around">
            <b className="text-slate-700 text-md">{memberNickname}</b>
            <p className="text-slate-500 text-sm">{profileStateMessage}</p>
          </div>
        </div>
        {music && (
          <div className=" px-2 gap-2 flex flex-row items-center justify-center  border-2 rounded-xl border-green-300">
            <p className="py-1  text-slate-500 text-xs">{music}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w- h-3 "
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
