import TopBar from "../components/TopBar";

export default function Login() {
  return (
    <div className="w-screen h-screen flex-col justify-start bg-themePurple">
      <TopBar isDark={true} />
      {/* Main */}
      <div className="flex flex-col justify-start items-center">
        {/* Logo */}
        <img
          src="/images/96TALK-Logo-Original.png"
          className="w-1/2 md:w-1/3"
        />
        <div className="flex flex-col h-48 w-1/2 md:w-1/3">
          <form className="flex flex-col w-full gap-4">
            <input name="id" className="h-10 px-4" placeholder="아이디" />
            <input
              name="password"
              className="h-10 px-4"
              placeholder="비밀번호"
            />
            <button className="bg-themeDarkPurple text-white h-10">
              로 그 인
            </button>
          </form>
        </div>
        <div>
          <h2>회원 가입</h2>
        </div>
      </div>
    </div>
  );
}
