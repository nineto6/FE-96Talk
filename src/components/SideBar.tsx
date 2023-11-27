import { useRecoilState } from "recoil";
import { loginState } from "../utils/atoms";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SideBar() {
  const [isLogin, setIslogin] = useRecoilState(loginState);

  const nav = useNavigate();
  const location = useLocation();
  let [isState, setIsState] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    setIsState(location.pathname.split("/")[1]);
  }, [location]);

  const onLogout = () => {
    let isToken = sessionStorage.getItem("accessToken");
    const url = "http://nineto6.kro.kr:8080/api/auth";

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${isToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          sessionStorage.removeItem("accessToken");
          nav("/login");
        } else {
          console.log(response.data.message);
        }
      });
  };

  const onMove = (target: React.MouseEvent<SVGElement>) => {
    // console.log(target.currentTarget.id);
    const dest = target.currentTarget.id;

    dest === "friend" ? nav("/") : nav(`/${dest}`);
  };

  return (
    <div className="fixed w-16 h-full min-h-full flex flex-col bg-themePurple text-themeDarkPurple pt-9 justify-start items-center gap-12">
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
  );
}
