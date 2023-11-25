import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const nav = useNavigate();

  const onMove = () => {
    nav("/profile");
  };

  return (
    <div className="hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-slate-300">
      <div className="flex flex-row justify-between w-auto gap-4">
        <div className="h-16 w-16 bg-violet-200 rounded-3xl" />
        <div className="flex flex-col justify-around">
          <b className="text-slate-700 text-md">이준모</b>
          <p className="text-slate-500 text-sm">안녕</p>
        </div>
      </div>
      <p
        onClick={onMove}
        className="transition-colors hover:bg-themePurple hover:text-slate-200 py-1 px-4 text-themePurple text-xs border rounded-xl border-themePurple"
      >
        프로필 수정하기 +
      </p>
    </div>
  );
}
