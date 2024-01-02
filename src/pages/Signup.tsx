import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import axios from "axios";
import Hood from "../components/Hood";
import { postSignup } from "../apis/apis";
import { useState } from "react";
import Loading from "../components/Loading";
import Messenger from "../components/Messenger";

export interface ISignupProps {
  memberEmail: string;
  memberNickname: string;
  memberPwd: string;
  memberPwdCheck: string;
}

export default function Signup() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorText, setIsErrorText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignupProps>();

  const onValid = async (data: ISignupProps) => {
    // console.log(data);
    if (data.memberPwd !== data.memberPwdCheck) {
      setError("memberPwdCheck", {
        type: "server",
        message: "비밀번호가 다릅니다.",
      });
    } else {
      // 두 값이 같을 때
      try {
        setIsLoading(true);
        const success = await postSignup(data);
        if (success) {
          // 성공했을 시
          console.log("Singup Success");
          nav("/login");
        }
      } catch (error) {
        console.error("Signup failed", error);
        if (error instanceof Error) {
          setIsError(true);
          setIsErrorText("회원가입 형식이 맞지 않습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-themePurple">
      <Hood title="회원가입" />
      <TopBar />
      {isLoading && <Loading />}
      {isError && <Messenger text={isErrorText} setIsError={setIsError} />}
      <div className="flex flex-col h-full justify-center items-center">
        {/* Logo */}

        <div className="flex flex-col h-auto w-1/2 md:w-1/3">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col w-full gap-4"
          >
            <input
              {...register("memberEmail", {
                required: "아이디를 입력하세요.",
              })}
              name="memberEmail"
              className="h-10 px-4"
              placeholder="아이디"
            />
            <input
              {...register("memberNickname", {
                required: "닉네임을 입력하세요.",
              })}
              name="memberNickname"
              className="h-10 px-4"
              placeholder="닉네임"
            />
            <input
              {...register("memberPwd", {
                required: "비밀번호를 입력하세요.",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
                  message:
                    "비밀번호는 소문자, 특수문자, 숫자를 포함해야 합니다.",
                },
              })}
              name="memberPwd"
              className="h-10 px-4"
              placeholder="비밀번호"
              type="password"
            />

            <input
              {...register("memberPwdCheck", {
                required: "비밀번호 확인란을 입력하세요.",
              })}
              name="memberPwdCheck"
              className="h-10 px-4"
              placeholder="비밀번호 확인"
              type="password"
            />
            <button className="bg-themeDarkPurple text-white h-10">
              회원 가입
            </button>
          </form>
          <h2 className="text-center mt-2 text-themeYellow">
            {errors.memberEmail
              ? errors.memberEmail.message
              : errors.memberPwd
              ? errors.memberPwd.message
              : errors.memberNickname
              ? errors.memberNickname.message
              : errors.memberPwdCheck
              ? errors.memberPwdCheck.message
              : ""}
          </h2>
        </div>
        <div>
          <h2
            onClick={() => {
              nav("/login");
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer mt-8"
          >
            로그인
          </h2>
        </div>
      </div>
    </div>
  );
}
