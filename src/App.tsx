import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/chats"} element={<Chats />} />
      <Route path={"/profile"} element={<Profile />} />
    </Routes>
  );
}