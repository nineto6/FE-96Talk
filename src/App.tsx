import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { useRecoilState } from "recoil";
import { loginState } from "./utils/atoms";
import Signup from "./pages/Signup";
import User from "./pages/User";

export default function App() {
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useRecoilState(loginState);

  // useEffect(() => {
  //   if (!isLogin) {
  //     nav("/login");
  //   }
  // }, [isLogin]);

  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/chats"} element={<Chats />} />
      <Route path={"/profile"} element={<Profile />} />
      <Route path={"/signup"} element={<Signup />} />
      <Route path={"/chats/:roomId"} element={<Chat />} />
      <Route path={"/user/:userNumber"} element={<User />} />
    </Routes>
  );
}
