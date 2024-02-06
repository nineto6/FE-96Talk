import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import Hood from "../components/Hood";
import {
  getDuplicateEmail,
  getDuplicateNickname,
  postSignup,
} from "../apis/apis";
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
    getValues,
    clearErrors,
    trigger,
  } = useForm<ISignupProps>();

  const [isLoginMessage, setIsLoginMessage] = useState<string>("");
  const [isNicknameMessage, setIsNicknameMessage] = useState<string>("");

  const onDuplicateEmailCheck = async () => {
    const target = getValues("memberEmail");
    const isValid = await trigger("memberEmail");
    if (isValid) {
      // 유효성 검사를 통과했을 경우
      try {
        const response = await getDuplicateEmail(target);
        if (response?.status === 200 && response?.data?.status === 200) {
          // 사용가능 한 메일일 경우
          setIsLoginMessage("사용가능한 이메일 입니다.");
          clearErrors("memberEmail");
        }
      } catch (error) {
        setIsLoginMessage("중복된 이메일 입니다.");
        setError("memberEmail", { message: "회원가입 조건이 맞지않습니다." });
      }
    } else {
      console.log("WRONG");
      setIsLoginMessage("");
    }
  };

  const onDuplicateNicknameCheck = async () => {
    const target = getValues("memberNickname");
    const isValid = await trigger("memberNickname");
    if (isValid && target) {
      // 유효성 검사를 통과했을 경우
      try {
        const response = await getDuplicateNickname(target);
        if (response?.status === 200 && response?.data?.status === 200) {
          // 사용가능 한 메일일 경우
          setIsNicknameMessage("사용가능한 닉네임 입니다.");
          clearErrors("memberNickname");
        }
      } catch (error) {
        setIsNicknameMessage("중복된 닉네임 입니다.");
        setError("memberNickname", {
          message: "회원가입 조건이 맞지않습니다.",
        });
      }
    } else {
      console.log("WRONG");
      setIsNicknameMessage("");
    }
  };

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
          nav("/");
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
      {isError && (
        <Messenger text={isErrorText} setIsError={setIsError} isShake={true} />
      )}
      <div className="flex flex-col h-full justify-center items-center">
        {/* Logo */}

        <div className="flex flex-col h-auto w-1/2 md:w-1/3">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col w-full gap-8"
          >
            <div className="flex flex-row gap-2 relative">
              <input
                {...register("memberEmail", {
                  required: "이메일을 입력하세요.",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                    message: "유효한 이메일 주소를 입력하세요.",
                  },
                })}
                name="memberEmail"
                className="h-10 px-4 w-3/4"
                placeholder="이메일"
              />
              <div
                onClick={onDuplicateEmailCheck}
                className="cursor-pointer flex justify-center items-center w-1/4 bg-themeDarkPurple text-white"
              >
                중복확인
              </div>
              <h2 className="text-white absolute left-0 -bottom-6 text-sm">
                {isLoginMessage}
              </h2>
            </div>
            <div className="flex flex-row gap-2 relative">
              <input
                {...register("memberNickname", {
                  required: "닉네임을 입력하세요.",
                  pattern: {
                    value: /^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$/,
                    message: "닉네임은 최소 2자리, 최대 10자리입니다.",
                  },
                })}
                name="memberNickname"
                className="h-10 px-4 w-3/4"
                placeholder="닉네임"
              />
              <div
                onClick={onDuplicateNicknameCheck}
                className="cursor-pointer flex justify-center items-center w-1/4 bg-themeDarkPurple text-white"
              >
                중복확인
              </div>
              <h2 className="text-white absolute left-0 -bottom-6 text-sm">
                {isNicknameMessage}
              </h2>
            </div>
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
              : errors.memberNickname
              ? errors.memberNickname.message
              : errors.memberPwd
              ? errors.memberPwd.message
              : errors.memberPwdCheck
              ? errors.memberPwdCheck.message
              : ""}
          </h2>
        </div>
        <div>
          <h2
            onClick={() => {
              nav("/");
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
