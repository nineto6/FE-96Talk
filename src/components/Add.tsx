import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IFriendProps } from "../pages/Main";
import { ring } from "ldrs";
import { getSearchProfileList, postAddFriend } from "../apis/apis";
import SearchProfile from "./SearchProfile";

/**
 * 링 모양 animation
 */
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
  list: IFriendProps[];
}

interface IPaginationProps {
  endPage: number;
  existNextPage: boolean;
  existPrevPage: boolean;
  limitStart: number;
  startPage: number;
  totalPageCount: number;
  totalRecordCount: number;
}

/**
 * 친구추가 components
 *
 * @param param0
 * @returns
 */
export default function Add({ title, onToggleAdd, list }: IAddProps) {
  const [findList, setFindList] = useState<IFriendProps[]>([]);
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
  // 이전페이지와 다음페이지로 움직일 수 있는지
  const [isPagination, setIsPagination] = useState<IPaginationProps>();
  const [pageTab, setPageTab] = useState<number[]>([1, 2, 3, 4, 5]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddDataProps>();

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // 애니메이션 적용 시 해당 특정 tag 지정

  const onAddFriend = async (targetName: string) => {
    try {
      const response = await postAddFriend(targetName);
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  /**
   * 유효성을 통과 했을 경우 검색 키워드가 공백이 아닐 시
   * 해당 특정 키워드와 일치하는 profile 을 가져와 나열
   */
  const onValid = async () => {
    setFindList([]);
    // 리스트를 비워줌

    if (isDataSet.keyword !== "") {
      setIsLoading(true);
      try {
        const response = await getSearchProfileList(isDataSet);
        // console.log(response);

        if (response.data.status === 200) {
          console.log(response.data.result);
          const { list, pagination } = response.data.result;
          setFindList(list);
          if (pagination) {
            setIsPagination(pagination);
            setCanMove((current) => {
              return {
                ...current,
                next: pagination.existNextPage,
                prev: pagination.existPrevPage,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   *  페이지 값을 가져와 dataSet 에 저장
   */
  const onGetPage = (event: React.MouseEvent<HTMLHeadElement>) => {
    const page = parseInt(event.currentTarget.innerText);
    setIsDataSet((current) => {
      return {
        ...current,
        page,
      };
    });
  };

  /**
   * prev 와 next 로 page 조작을 하며 페이지 전환
   */
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

      setPageTab(() => {
        return pageTab.map((tab) => (tab += isDataSet.pageSize));
      });
    }

    if (order === "prevPage") {
      setIsDataSet((current) => {
        return {
          ...current,
          page: isDataSet.page - isDataSet.pageSize,
        };
      });

      setPageTab(() => {
        return pageTab.map((tab) => (tab -= isDataSet.pageSize));
      });
    }
  };

  /**
   * 검색 키워드를 변경하는 함수
   */
  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.currentTarget.value;
    setIsDataSet((current) => {
      return {
        ...current,
        keyword,
      };
    });
  };

  /**
   * 첫 마운트 시 observer 를 사용해 검색 창이 뜰 때의 animation 지정
   *
   * 또한 dataSet 이 변경 됐을 시 새로 화면을 보여줘야 하기 때문에 [] 에 isDataSet 추가
   */
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

  useEffect(() => {
    onValid();
  }, [isDataSet]);

  return (
    <div className="bg-slate-500 bg-opacity-25 h-full w-full z-50 fixed flex flex-col justify-center items-center">
      <div
        ref={ref}
        className={`${
          isVisible ? "animate-bounce-up " : ""
        } rounded-md shadow-xl flex flex-col justify-center items-start md:w-1/3 w-2/3 h-auto p-8 bg-white opacity-none`}
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
              findList.map((target, index) => {
                const canAdd = list.some(
                  (item) => item.memberNickname === target.memberNickname
                );
                return (
                  <SearchProfile
                    key={index}
                    memberNickname={target.memberNickname}
                    imageName={target.imageName}
                    onAddFriend={() => {
                      onAddFriend(target.memberNickname);
                    }}
                    type={target.type}
                    canAdd={canAdd}
                  />
                );
              })}

            {findList.length !== 0 && (
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
                {isPagination &&
                  pageTab
                    .filter((page) => page <= isPagination.endPage)
                    .map((page, index) => (
                      <h4 key={index} onClick={onGetPage}>
                        {page}
                      </h4>
                    ))}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
