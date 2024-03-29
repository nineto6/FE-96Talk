import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IFriendProps } from "../pages/Main";
import { useNavigate } from "react-router-dom";
import SearchProfile from "./SearchProfile";

interface ISearchDataProps {
  searchData: string;
}

interface ISearchProps {
  title: string;
  onToggleSearch: Function;
  list: IFriendProps[];
}

/**
 * 친구목록에 존재하는 친구를 검색하는 component
 *
 * @param title
 * @param onToggleSearch modal 창을 끄기 위한 toggle 함수
 * @param list 검색 결과와 비슷한 친구를 가져오는 list
 * @returns
 */
export default function Search({ title, onToggleSearch, list }: ISearchProps) {
  const [findList, setFindList] = useState("");
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ISearchDataProps>();

  const onFindList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFindList(value);
    setValue("searchData", value);
  };

  const onValid = () => {};

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(list);
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
        } rounded-md shadow-xl flex flex-col justify-center items-start md:w-1/3 w-2/3 h-auto p-12 bg-white opacity-none`}
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
              onToggleSearch();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-lg text-slate-800 font-bold mb-4">{title} 찾기</h2>
        <form className="w-full" onSubmit={handleSubmit(onValid)}>
          <div className="flex gap-4">
            <input
              {...register("searchData", {
                required: "검색 내용을 입력해주세요.",
              })}
              onChange={onFindList}
              className="border-b-2 w-full focus:outline-none"
              autoComplete="off"
            />
            <button className="py-2 px-4 bg-violet-400 w-24 focus:outline-none text-slate-200">
              검 색
            </button>
          </div>
        </form>

        <div className="w-full mt-12">
          {findList.trim() === "" ? (
            <div className="flex justify-center items-center">
              <h1>검색 할 {title} 명을 입력하세요</h1>
            </div>
          ) : (
            list &&
            list
              .filter((friend) => friend.memberNickname.includes(findList))
              .map((friend, index) => (
                <SearchProfile
                  key={index}
                  memberNickname={friend.memberNickname}
                  imageName={friend.imageName}
                  type={friend.type}
                  canAdd={true}
                />
              ))
              .slice(0, 5)
            //   5개만 출력
          )}
        </div>
      </div>
    </div>
  );
}
