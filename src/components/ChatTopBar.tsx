import { useEffect, useState } from "react";
import { IUserProps } from "../pages/User";
import { getProfileImage } from "../apis/apis";
import { useNavigate } from "react-router-dom";

interface IChatTopBarProps {
  isPartner: IUserProps[];
  setIsLoading: Function;
}

export default function ChatTopBar({
  isPartner,
  setIsLoading,
}: IChatTopBarProps) {
  const [isImage, setIsImage] = useState<string>("");
  const nav = useNavigate();

  const onMove = () => {
    // 첫 멤버의 profile 로 이동.
    // 현재 ver1 이므로 개인챗 밖에 안됨
    nav(`/user/${isPartner[0].memberNickname}`);
  };

  useEffect(() => {
    // console.log(isPartner);
    setIsLoading(true);

    const getImage = async () => {
      if (isPartner[0].imageName && isPartner[0].type) {
        try {
          const imageResponse = await getProfileImage(
            isPartner[0].imageName,
            isPartner[0].type
          );
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setIsImage(base64data);
            setIsLoading(false);
          };
        } finally {
        }
      }
    };

    getImage();
  }, [isPartner]);

  return (
    <div className="flex px-4 flex-row justify-start w-auto gap-4">
      <div
        className="h-16 w-16 bg-violet-200 rounded-3xl cursor-pointer"
        style={{
          backgroundImage: `url(${isImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={onMove}
      />
      <div className="flex flex-col justify-around">
        <b className="text-slate-700 text-md">
          {isPartner.map((partner) => partner.memberNickname)}
        </b>
      </div>
    </div>
  );
}
