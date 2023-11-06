import { useNavigate } from "react-router-dom";

interface IFriendProps {
  name: string;
  quote?: string | null;
  music?: string;
  image: string;
  userId: number;
}

export default function FriendList({
  name,
  quote,
  music,
  image,
  userId,
}: IFriendProps) {
  const nav = useNavigate();

  const onMove = () => {
    nav(`user/${userId}`);
  };

  return (
    <div
      onClick={onMove}
      className="hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-b border-slate-300"
    >
      <div className="flex flex-row justify-between w-auto gap-4">
        <div className="h-14 w-14 bg-cyan-200 rounded-3xl" />
        <div className="flex flex-col justify-around">
          <b className="text-slate-700 text-md">{name}</b>
          <p className="text-slate-500 text-sm">{quote}</p>
        </div>
      </div>
      <p className="py-1 px-4 text-slate-500 text-xs border-2 rounded-xl border-green-300">
        {music}
      </p>
    </div>
  );
}
