import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import { error } from "console";
import { useState } from "react";
import Loading from "../components/Loading";
import { useRecoilState } from "recoil";
import { loginState } from "../utils/atoms";

interface ILoginProps {
  loginId: string;
  loginPassword: string;
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

  const onValid = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLogin(true);
      // 로그인 상태로 변환
      // nav("/");
      nav("/");
    }, 3000);
  };

  return (
    <div className="w-screen h-screen flex-col justify-start bg-themePurple">
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
              {...register("loginId", {
                required: "아이디를 입력해주세요",
              })}
              name="loginId"
              className="h-10 px-4"
              placeholder="아이디"
            />
            <input
              {...register("loginPassword", {
                required: "비밀번호를 입력해주세요",
              })}
              name="loginPassword"
              className="h-10 px-4"
              placeholder="비밀번호"
              type="password"
            />
            <button className="bg-themeDarkPurple text-white h-10">
              로 그 인
            </button>
          </form>
          <h2 className="text-center mt-2 text-themeYellow">
            {errors.loginId
              ? errors.loginId.message
              : errors.loginPassword
              ? errors.loginPassword.message
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
