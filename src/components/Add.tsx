import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IFriendProps } from "../pages/Main";
import { useNavigate } from "react-router-dom";
import { ring } from "ldrs";
import axios from "axios";
import { getSearchProfileList } from "../apis/apis";
import { IMyProfileProps } from "./MyProfile";

ring.register();

export interface IAddDataProps {
  keyword: string;
  page: number;
  recordSize: number;
  pageSize: number;
}

interface IAddProps {
  title: string;
  onToggleAdd: Function;
}

export default function Add({ title, onToggleAdd }: IAddProps) {
  const [findList, setFindList] = useState<IMyProfileProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSet, setIsDataSet] = useState<IAddDataProps>({
    keyword: "",
    page: 1,
    recordSize: 4,
    pageSize: 5,
  });
  // form 값 임시 저장소

  const [canMove, setCanMove] = useState({
    prev: false,
    next: false,
  });

  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IAddDataProps>();

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

  const onAddFriend = () => {
    const url = "http://localhost:8080/";
    try {
      setIsLoading(true);
      axios.get(url, {
        headers: {
          Authorization: "",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onValid = async () => {
    console.log(isDataSet);
    try {
      const response = await getSearchProfileList(isDataSet);
      console.log(response);

      if (response.data.status === 200) {
        console.log(response.data.result);
        const { list, pagination } = response.data.result;
        setFindList(list);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const onGetPage = (event: React.MouseEvent<HTMLHeadElement>) => {
    // console.log(event.currentTarget.innerText);
    const page = parseInt(event.currentTarget.innerText);
    setIsDataSet((current) => {
      return {
        ...current,
        page,
      };
    });
  };

  const onChangePage = (event: React.MouseEvent<SVGSVGElement>) => {
    // console.log(event.currentTarget.id);
    let order = event.currentTarget.id;

    if (order === "nextPage") {
      setIsDataSet((current) => {
        return {
          ...current,
          page: isDataSet.pageSize + isDataSet.page,
        };
      });
    }

    if (order === "prevPage") {
      setIsDataSet((current) => {
        return {
          ...current,
          page: isDataSet.page - isDataSet.pageSize,
        };
      });
    }
  };

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.currentTarget.value);
    const keyword = event.currentTarget.value;
    setIsDataSet((current) => {
      return {
        ...current,
        keyword,
      };
    });
  };

  return (
    <div className="bg-slate-500 bg-opacity-25 h-full w-full z-50 fixed flex flex-col justify-center items-center">
      <div
        ref={ref}
        className={`${
          isVisible ? "animate-bounce-up " : ""
        } rounded-md shadow-xl flex flex-col justify-center items-start w-2/3 h-auto p-8 bg-white opacity-none`}
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
              {...register("keyword", {
                required: "검색 내용을 입력해주세요.",
              })}
              className="border-b-2 w-full focus:outline-none"
              autoComplete="off"
              onChange={onChangeKeyword}
            />
            <button className="py-2 px-4 bg-violet-400 w-24 focus:outline-none text-slate-200">
              검 색
            </button>
          </div>
        </form>
        {isLoading ? (
          <div className="pt-20 pb-6 flex flex-col justify-center items-center w-full">
            <l-ring
              size="40"
              stroke="5"
              bg-opacity="0"
              speed="2"
              color="rgb(167 139 250 / var(--tw-bg-opacity))"
            />
          </div>
        ) : (
          <div className="w-full mt-12 flex flex-col gap-2">
            {findList &&
              findList.map((target, index) => (
                <div
                  key={index}
                  className=" hover:bg-slate-50 cursor-pointer w-full flex flex-row justify-between items-center gap-12 py-2 border-b-2 last:border-none border-dashed"
                >
                  <div className="flex flex-row justify-start gap-12 items-center">
                    <div
                      style={{
                        backgroundImage: `SET`,
                      }}
                      className="w-16 h-16 rounded-3xl bg-purple-200"
                    />
                    <h3>{target.memberNickname}</h3>
                  </div>
                  <div>
                    {/* Button Box */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 hover:text-violet-400 text-slate-600"
                      onClick={onAddFriend}
                    >
                      <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                    </svg>
                  </div>
                </div>
              ))}

            <div className="w-full flex flex-row gap-6 justify-center items-center mt-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-6 h-6 ${
                  canMove.prev === false ? "opacity-25" : "cursor-pointer"
                }`}
                onClick={onChangePage}
                id="nextButton"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <h4 onClick={onGetPage}>1</h4>
              <h4 onClick={onGetPage}>2</h4>
              <h4 onClick={onGetPage}>3</h4>
              <h4 onClick={onGetPage}>4</h4>
              <h4 onClick={onGetPage}>5</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-6 h-6 ${
                  canMove.next === false ? "opacity-25" : "cursor-pointer"
                }`}
                onClick={onChangePage}
                id="nextButton"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
