import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import Hood from "../components/Hood";
import axios from "axios";
import { access } from "fs";
import { useNavigate } from "react-router-dom";
import {
  getProfileData,
  getProfileImage,
  patchProfileData,
} from "../apis/apis";
import Loading from "../components/Loading";

export interface IProfileProps {
  imageFile: string | null;
  profileStateMessage: string;
  type: string | null;
}

export default function Profile() {
  const [isModify, setIsModify] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isName, setIsName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const [isData, setIsData] = useState<IProfileProps>({
    imageFile: null,
    profileStateMessage: "",
    type: null,
  });
  // re-rendering 을 하기 위한 상태 저장용

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<IProfileProps>();

  const onModify = () => {
    setIsModify((current) => !current);
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file); // 파일 상태 저장

      // 파일 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCancel = () => {
    try {
      setIsLoading(true);
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const onValid = async (data: IProfileProps) => {
    // console.log(typeof data.imageFile);
    const formData = new FormData();
    if (selectedFile) {
      formData.append("imageFile", selectedFile);
    }

    formData.append("profileStateMessage", data.profileStateMessage);

    setIsModify((current) => !current);
    const request = await patchProfileData(formData).then((response) => {
      console.log(response);
      nav("/");
    });
  };

  const onChangeQuote = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    setIsData((current) => {
      return { ...current, profileStateMessage: value };
    });
  };

  useEffect(() => {
    const getRequest = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await getProfileData();
        // console.log(profileResponse);

        const {
          imageName,
          type,
          memberNickname,
          imageFile,
          profileStateMessage,
        } = profileResponse.data.result;

        // 상태 업데이트
        setIsName(memberNickname);
        setImagePreview(imageFile);
        setImageName(imageName);
        setType(type);

        setIsData((current) => ({
          ...current,
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
            setImagePreview(base64data);
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
    <div className="flex flex-row">
      <Hood title="프로필 수정" />
      {/* Container */}
      <SideBar />
      {isLoading && <Loading />}
      <div className="ml-16 h-full flex w-full flex-col justify-start">
        <TopBar />
        {/* Body */}
        <div className="flex flex-col justify-start px-4 pt-4">
          {/* Detail Bar */}
          <div className="flex flex-row justify-between items-center">
            {/* title */}
            <h2 className="text-xl font-bold">프로필</h2>
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
          <div className="py-8 flex flex-col justify-center items-center">
            {/* profile info */}
            {/* profile image */}

            <div className="mt-12">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex flex-col w-72 gap-2"
              >
                <div className="flex flex-col justify-center items-center">
                  <span
                    className="w-32 h-32 bg-violet-200 mb-4 rounded-full relative"
                    style={{
                      backgroundImage: `url(${imagePreview})`,
                      backgroundSize: "cover", // 이미지를 span 크기에 맞게 조절
                      backgroundPosition: "center", // 이미지를 중앙에 위치시킴
                    }}
                  >
                    <label
                      className={`absolute right-0 bottom-0 bg-slate-200 text-slate-800 flex justify-center items-center p-2 rounded-full cursor-pointer ${
                        isModify && "hidden"
                      }`}
                      htmlFor="input-file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                        <path
                          fillRule="evenodd"
                          d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                    <input
                      id="input-file"
                      type="file"
                      className="hidden"
                      {...register("imageFile")}
                      onChange={onImageChange}
                      accept=".png, .jpg, .jpeg"
                    />
                    {/* 파일 담는 input, hidden 시키고 label 을 누를 때 동작하도록 함 */}
                  </span>
                </div>
                <div className="border-b-2 relative">
                  <div
                    className="px-8 h-8 bg-transparent text-center w-full focus:outline-none text-slate-800"
                    // value={isData.memberNickname}
                    // onChange={onChangeName}
                  >
                    <h2>{isName}</h2>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 absolute top-1.5 right-2 text-slate-800 ${
                      isModify && "hidden"
                    }`}
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </div>
                <div className="border-b-2 relative">
                  <input
                    readOnly={isModify}
                    className="px-8 h-8 bg-transparent text-center w-full focus:outline-none text-slate-800"
                    {...register("profileStateMessage")}
                    onChange={onChangeQuote}
                    value={isData?.profileStateMessage || ""}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 absolute top-1.5 right-2 text-slate-800 ${
                      isModify && "hidden"
                    }`}
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </div>
                {/* <input className="h-8 border-b-2 bg-transparent" /> */}
                <div className="mt-8 flex flex-row justify-center gap-12">
                  <div
                    onClick={onModify}
                    className={`py-2 px-6 flex justify-center items-center bg-slate-200 cursor-pointer ${
                      !isModify && "hidden"
                    }`}
                  >
                    <h3>수정하기</h3>
                  </div>
                  <div
                    onClick={onCancel}
                    className={`py-2 px-6 flex justify-center items-center bg-slate-200 cursor-pointer ${
                      isModify && "hidden"
                    }`}
                  >
                    <h3>취 소</h3>
                  </div>

                  <button
                    className={`py-2 px-6 flex justify-center items-center bg-slate-200 cursor-pointer ${
                      isModify && "hidden"
                    }`}
                  >
                    <h3>저 장</h3>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
