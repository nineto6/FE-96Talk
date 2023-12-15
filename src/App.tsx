import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import User from "./pages/User";
import { stompClient } from "./utils/globals";
import { getProfileData } from "./apis/apis";
import initialStomp from "./utils/initialStomp";
import { requestNotification } from "./utils/notification";

export default function App() {
  const nav = useNavigate();
  useEffect(() => {
    if (stompClient.instance === null) {
      // console.log("NO");
      const connection = async () => {
        await getProfileData()
          .then((response: any) => {
            if (response.status === 200 && response.data?.status === 200) {
              const { memberNickname } = response.data.result;
              // console.log(memberNickname);
              initialStomp(memberNickname);
            }
          })
          .catch((error: any) => {
            console.error(error);
            nav("/login");
          });
      };

      connection();
    }
  }, []);

  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/chats"} element={<Chats />} />
      <Route path={"/profile"} element={<Profile />} />
      <Route path={"/signup"} element={<Signup />} />
      <Route path={"/chats/:chatroomChannelId"} element={<Chat />} />
      <Route path={"/user/:userNumber"} element={<User />} />
    </Routes>
  );
}
