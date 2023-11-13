import { useEffect, useRef, useState } from "react";
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

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      onClick={onMove}
      className={` ${isVisible ? "animate-bounce-up " : ""}
        hover:bg-slate-50 cursor-pointer transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-b border-slate-300`}
    >
      <div className="flex flex-row justify-between w-auto gap-4">
        <div className="h-14 w-14 bg-violet-200 rounded-3xl" />
        <div className="flex flex-col justify-around">
          <b className="text-slate-700 text-md">{name}</b>
          <p className="text-slate-500 text-sm">{quote}</p>
        </div>
      </div>
      <div className=" px-2 gap-2 flex flex-row items-center justify-center  border-2 rounded-xl border-green-300">
        <p className="py-1  text-slate-500 text-xs">{music}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w- h-3 "
        >
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
      </div>
    </div>
  );
}
