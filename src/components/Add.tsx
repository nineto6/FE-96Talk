import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IFriendProps } from "../pages/Main";
import { useNavigate } from "react-router-dom";
import { ring } from "ldrs";

ring.register();

interface IAddDataProps {
  searchData: string;
}

interface IAddProps {
  title: string;
  onToggleAdd: Function;
}

export default function Add({ title, onToggleAdd }: IAddProps) {
  const [findList, setFindList] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IAddDataProps>();

  const onValid = () => {};

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
    <div className="bg-slate-500 bg-opacity-25 h-full w-full z-50 fixed flex flex-col justify-center items-center">
      <div
        ref={ref}
        className={`${
          isVisible ? "animate-bounce-up " : ""
        } rounded-md shadow-xl flex flex-col justify-center items-start w-2/3 h-auto p-12 bg-white opacity-none`}
      >
        <div className="flex flex-row items-center w-full justify-end mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              onToggleAdd();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-lg text-slate-800 font-bold mb-4">{title}</h2>
        <form className="w-full" onSubmit={handleSubmit(onValid)}>
          <div className="flex gap-4">
            <input
              {...register("searchData", {
                required: "검색 내용을 입력해주세요.",
              })}
              className="border-b-2 w-full focus:outline-none"
              autoComplete="off"
            />
            <button className="py-2 px-4 bg-violet-400 w-24 focus:outline-none text-slate-200">
              검 색
            </button>
          </div>
        </form>
        <div className="pt-20 pb-6 flex flex-col justify-center items-center w-full">
          <l-ring
            size="40"
            stroke="5"
            bg-opacity="0"
            speed="2"
            color="rgb(167 139 250 / var(--tw-bg-opacity))"
          />
        </div>
      </div>
    </div>
  );
}
