import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import User from "./pages/User";
import { refreshToken } from "./apis/refresh";
import Loading from "./components/Loading";

export default function App() {
  const nav = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      refreshToken(loginCallBack);
    } catch(error) {
      console.log(error);
    }
  }, []);

  function loginCallBack(login:boolean) {
    setIsLogin(login);
    setLoading(true);
  }

  if(loading) {

    if(isLogin && location.pathname === "/") {
      nav("/main");
    }
    
    return (
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route path={"/main"} element={<Main />} />
        <Route path={"/chats"} element={<Chats />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/chats/:chatroomChannelId"} element={<Chat />} />
        <Route path={"/user/:userNumber"} element={<User />} />
      </Routes>
    );
  } else {
    // 로딩 렌더
    return (
      <Loading/>
    )
  }
}
