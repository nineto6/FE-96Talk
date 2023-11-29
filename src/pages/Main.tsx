import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import FriendList from "../components/FriendList";
import { useRecoilState } from "recoil";
import { loginState } from "../utils/atoms";
import TopBar from "../components/TopBar";
import { friends } from "../jsons/dummy";
import MyProfile from "../components/MyProfile";
import Search from "../components/Search";
import Hood from "../components/Hood";
import Add from "../components/Add";
import axios from "axios";

axios.defaults.withCredentials = true;
// Cookie 를 사용하기 위함

export interface IFriendProps {
  name: string;
  quote?: string | null;
  music: string;
  image: string;
  userId: number;
}

export default function Main() {
  const [isSearch, setIsSearch] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    let isToken = sessionStorage.getItem("accessToken");
    if (isToken) {
      const url = "http://nineto6.kro.kr:8080/api/friends";
    }
  }, []);

  const onToggleSearch = () => {
    setIsSearch((current) => !current);
  };

  const onToggleAdd = () => {
    setIsAdd((current) => !current);
  };

  return (
    <div className="flex flex-row">
      <Hood title="친구 목록" />
      {/* Container */}
      {isSearch && (
        <Search title={"친구"} onToggleSearch={onToggleSearch} list={friends} />
      )}
      {isAdd && <Add title="아이디로 친구 추가" onToggleAdd={onToggleAdd} />}
      <SideBar />
      <div className="ml-16 h-full flex w-full flex-col justify-start">
        <TopBar />
        {/* Body */}
        <div className="flex flex-col justify-start px-4 pt-4">
          {/* Detail Bar */}
          <div className="flex flex-row justify-between items-center">
            {/* title */}
            <h2 className="text-xl font-bold">친구</h2>
            {/* utilities */}
            <div className="bg-transparent flex flex-row gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
                onClick={onToggleSearch}
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
                className="w-6 h-6 cursor-pointer"
                onClick={onToggleAdd}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </div>
          </div>

          <MyProfile />
        </div>
        <div className="relative -z-10">
          <div className="absolute px-4 mt-3 w-full border-t border-slate-300" />
          <div className="relative -top-0 text-center">
            <span className="bg-white px-2 text-sm text-slate-500">
              친구 {443}
            </span>
          </div>
        </div>
        <div className="mx-4">
          {friends.map((friend) => (
            <FriendList
              key={friend.userId}
              name={friend.name}
              quote={friend.quote}
              music={friend.music}
              image={friend.image}
              userId={friend.userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
