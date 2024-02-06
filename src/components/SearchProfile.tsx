import { useEffect, useState } from "react";
import { getProfileImage } from "../apis/apis";
import { useNavigate } from "react-router-dom";

interface ISearchProfileProps {
  memberNickname: string;
  imageName: string | null;
  onAddFriend?: any;
  type: string | null;
  canAdd: boolean;
}

/**
 * 검색한 결과와 일치하는 친구 정보 component
 *
 * @param memberNickname 친구 닉네임
 * @param imageName 친구 이미지
 * @param onAddFriend 친구 추가 함수 (기존에 친구면 나타나지 않음)
 * @param type 이미지 타입
 * @param canAdd 친구 추가 할 수 있는지
 * @returns
 */
export default function SearchProfile({
  memberNickname,
  imageName,
  onAddFriend,
  type,
  canAdd,
}: ISearchProfileProps) {
  const [isImage, setIsImage] = useState<string>("");
  const nav = useNavigate();

  const onMove = () => {
    nav(`/user/${memberNickname}`);
  };

  useEffect(() => {
    const getImage = async () => {
      if (imageName && type) {
        try {
          //   setIsLoading(true);
          const imageResponse = await getProfileImage(imageName, type);
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setIsImage(base64data);
          };
        } finally {
        }
      }
    };

    getImage();
  }, []);

  return (
    <div
      onClick={onMove}
      className=" hover:bg-slate-50 cursor-pointer w-full flex flex-row justify-between items-center gap-12 py-2 border-b-2 last:border-none border-dashed"
    >
      <div className="flex flex-row justify-start gap-12 items-center">
        <div
          style={{
            backgroundImage: `url(${isImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-16 h-16 rounded-3xl bg-purple-200"
        />
        <h3>{memberNickname}</h3>
      </div>
      <div>
        {/* Button Box */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 hover:text-violet-400 text-slate-600 ${
            canAdd && "hidden"
          }`}
          onClick={onAddFriend}
        >
          <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
        </svg>
      </div>
    </div>
  );
}
