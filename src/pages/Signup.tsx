import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useForm } from "react-hook-form";
import axios from "axios";
import Hood from "../components/Hood";

interface ISignupProps {
  memberEmail: string;
  memberNm: string;
  memberPwd: string;
  memberPwdCheck: string;
}

interface ISendDataProps {}

export default function Signup() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ISignupProps>();

  const onValid = (data: ISignupProps) => {
    console.log(data);
    if (data.memberPwd !== data.memberPwdCheck) {
      setError("memberPwdCheck", {
        type: "server",
        message: "비밀번호가 다릅니다.",
      });
    } else {
      // 두 값이 같을 때
      const url = "http://nineto6.kro.kr:8080/api/members/signup";

      axios.post(url, data).then((response) => {
        if (response.data.status === 201) {
          console.log(response.data.message);
          nav("/login");
        } else {
          console.log(response.data.message);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-themePurple">
      <Hood title="회원가입" />
      <TopBar />
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
              {...register("memberNm", {
                required: "닉네임을 입력하세요.",
              })}
              name="memberNm"
              className="h-10 px-4"
              placeholder="닉네임"
            />
            <input
              {...register("memberPwd", {
                required: "비밀번호를 입력하세요.",
              })}
              name="memberPwd"
              className="h-10 px-4"
              placeholder="비밀번호"
              type="memberPwd"
            />

            <input
              {...register("memberPwdCheck", {
                required: "비밀번호 확인란을 입력하세요.",
              })}
              name="memberPwdCheck"
              className="h-10 px-4"
              placeholder="비밀번호 확인"
              type="memberPwd"
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
              : errors.memberNm
              ? errors.memberNm.message
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
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            로그인
          </h2>
        </div>
      </div>
    </div>
  );
}
