import { useNavigate } from "react-router-dom";

interface ITopBarProps {
  isDark?: boolean;
}

/**
 * 최상단 바 component
 *
 * ver2. 에서 다크모드 구현 예정
 *
 * @param isDark 다크모드 인지 확인하는 boolean 타입 변수
 * @returns
 */
export default function TopBar({ isDark }: ITopBarProps) {
  const nav = useNavigate();
  const onBack = () => {
    nav(-1);
  };

  return (
    <div
      className={`bg-transparent h-5 flex flex-row justify-end items-center gap-2 px-2 ${
        isDark ? "text-white" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 cursor-pointer"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 cursor-pointer"
        onClick={onBack}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
