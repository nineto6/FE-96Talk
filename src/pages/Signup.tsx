import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";

interface ISignupProps {
  userId: string;
  nickname: string;
  password: string;
  passwordCheck: string;
}

export default function Signup() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignupProps>();

  const onValid = () => {};

  return (
    <div className="flex flex-col w-full h-screen bg-themePurple">
      <TopBar />
      <div className="flex flex-col h-full justify-center items-center">
        {/* Logo */}

        <div className="flex flex-col h-auto w-1/2 md:w-1/3">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col w-full gap-4"
          >
            <input
              {...register("userId", {
                required: "아이디를 입력하세요.",
              })}
              name="userId"
              className="h-10 px-4"
              placeholder="아이디"
            />
            <input
              {...register("nickname", {
                required: "닉네임을 입력하세요.",
              })}
              name="nickname"
              className="h-10 px-4"
              placeholder="닉네임"
            />
            <input
              {...register("password", {
                required: "비밀번호를 입력하세요.",
              })}
              name="password"
              className="h-10 px-4"
              placeholder="비밀번호"
              type="password"
            />

            <input
              {...register("passwordCheck", {
                required: "비밀번호 확인란을 입력하세요.",
              })}
              name="passwordCheck"
              className="h-10 px-4"
              placeholder="비밀번호 확인"
              type="password"
            />
            <button className="bg-themeDarkPurple text-white h-10">
              회원 가입
            </button>
          </form>
          <h2 className="text-center mt-2 text-themeYellow">
            {/* {errors.loginId
              ? errors.loginId.message
              : errors.loginPassword
              ? errors.loginPassword.message
              : ""} */}
          </h2>
        </div>
        <div>
          <h2
            onClick={() => {
              nav("/login");
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            로그인
          </h2>
        </div>
      </div>
    </div>
  );
}
