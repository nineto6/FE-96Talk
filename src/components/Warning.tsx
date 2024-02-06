import { useState } from "react";

interface IWarningProps {
  addFriend: Function;
}

/**
 * 채팅방 내 경고 component
 *
 * 친구로 등록되지 않은 사용자 일 시 경고문구를 출력
 *
 * @param addFriend 친구 추가 함수
 * @returns
 */
export default function Warning({ addFriend }: IWarningProps) {
  const [isSpread, setIsSpread] = useState(false);

  const onToggleSpread = () => {
    setIsSpread((current) => !current);
  };

  return (
    <div className="text-slate-700 flex py-2 gap-2 px-8 flex-row items-center justify-between absolute top-20 bg-opacity-50 left-0 bg-violet-200 w-full min-h-[3.5rem]">
      <h2 className={`${isSpread && "truncate"}`}>
        친구로 등록되지 않은 사용자 입니다. 사용자로부터의 메시지에 주의하시기
        바랍니다. 해당 사용자를 친구로 추가하거나 관리자에게 문의해 주세요.
      </h2>
      <div className="flex flex-row gap-2 justify-between items-center">
        {isSpread ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 md:hidden cursor-pointer"
            onClick={onToggleSpread}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 md:hidden cursor-pointer"
            onClick={onToggleSpread}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        )}

        <div
          onClick={() => {
            addFriend();
          }}
          className="flex flex-col justify-center items-center border-violet-500 border py-2 px-4 text-xs rounded-3xl bg-violet-500 text-violet-50 cursor-pointer"
        >
          <h2 className="truncate">친구 추가</h2>
        </div>
      </div>
    </div>
  );
}
