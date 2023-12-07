import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileData, getProfileImage } from "../apis/apis";
import Loading from "./Loading";

export interface IMyProfileProps {
  memberNickname: string;
  imageFile: string | null;
  profileStateMessage: string;
  type: string | null;
}

export default function MyProfile() {
  const nav = useNavigate();
  const [isData, setIsData] = useState<IMyProfileProps>({
    memberNickname: "",
    imageFile: null,
    profileStateMessage: "",
    type: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isImage, setIsImage] = useState<string>("");

  const onMove = () => {
    nav("/profile");
  };

  useEffect(() => {
    const getRequest = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await getProfileData();

        const {
          imageName,
          type,
          memberNickname,
          imageFile,
          profileStateMessage,
        } = profileResponse.data.result;

        setIsData((current) => ({
          ...current,
          memberNickname,
          profileStateMessage,
          imageFile,
          type,
        }));

        if (imageName && type) {
          const imageResponse = await getProfileImage(imageName, type);
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setIsImage(base64data);
          };
        }
      } catch (error) {
        console.error("Error in getRequest:", error);
        nav("/login");
        // 다시 로그인하게 유도
      } finally {
        setIsLoading(false);
      }
    };

    getRequest();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-slate-300">
        <div className="flex flex-row justify-between w-auto gap-4">
          <div
            className="h-16 w-16 bg-violet-200 rounded-3xl"
            style={{
              backgroundImage: `url(${isImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="flex flex-col justify-around">
            <b className="text-slate-700 text-md">{isData.memberNickname}</b>
            {isData.profileStateMessage && (
              <p className="text-slate-500 text-sm">
                {isData.profileStateMessage}
              </p>
            )}
          </div>
        </div>
        <p
          onClick={onMove}
          className="transition-colors hover:bg-themePurple hover:text-slate-200 py-1 px-4 text-themePurple text-xs border rounded-xl border-themePurple"
        >
          프로필 수정하기 +
        </p>
      </div>
    </>
  );
}
