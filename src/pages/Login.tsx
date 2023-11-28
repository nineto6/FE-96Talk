import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import { error } from "console";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useRecoilState } from "recoil";
import { loginState } from "../utils/atoms";
import axios from "axios";
import Hood from "../components/Hood";
import { postLogin } from "../apis/apis";

export interface ILoginProps {
  memberEmail: string;
  memberPwd: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useRecoilState(loginState);

  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ILoginProps>();

  const onValid = async (data: ILoginProps) => {
    try {
      setIsLoading(true);
      const success = await postLogin(data);
      if (success) {
        // 성공 시 홈화면으로 return
        nav("/");
        console.log("LOGIN SUCCESS");
      }
    } catch (error) {
      console.error("LOGIN FAILED", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="w-screen h-screen flex-col justify-start bg-themePurple">
      <Hood title="로그인" />
      {isLoading && <Loading />}
      <TopBar isDark={true} />
      {/* Main */}
      <div className="flex flex-col justify-start items-center">
        {/* Logo */}
        <img
          src="/images/96TALK-Logo-Original.png"
          className="w-1/2 md:w-1/3"
        />
        <div className="flex flex-col h-48 w-1/2 md:w-1/3">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col w-full gap-4"
          >
            <input
              {...register("memberEmail", {
                required: "아이디를 입력해주세요",
              })}
              name="memberEmail"
              className="h-10 px-4"
              placeholder="아이디"
            />
            <input
              {...register("memberPwd", {
                required: "비밀번호를 입력해주세요",
              })}
              name="memberPwd"
              className="h-10 px-4"
              placeholder="비밀번호"
              type="password"
            />
            <button className="bg-themeDarkPurple text-white h-10">
              로 그 인
            </button>
          </form>
          <h2 className="text-center mt-2 text-themeYellow">
            {errors.memberEmail
              ? errors.memberEmail.message
              : errors.memberPwd
              ? errors.memberPwd.message
              : ""}
          </h2>
        </div>
        <div>
          <h2
            onClick={() => {
              nav("/signup");
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            회원 가입
          </h2>
        </div>
      </div>
    </div>
  );
}
