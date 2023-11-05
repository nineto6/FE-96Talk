import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import SideBar from "./components/SideBar";
import Login from "./pages/Login";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path={"/login"} element={<Login />} />
    </Routes>
  );
}
