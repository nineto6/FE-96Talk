import { useEffect, useState } from "react";
import dateFormatter from "../utils/formatter";

interface IBubbleProps {
  text: string;
  speaker: boolean;
  time: string;
  //   말하는 사람이 본인인지
}

/**
 * 채팅 방 내 채팅 말풍선 components
 * @param text 채팅내용 @param speaker 화자 본인여부 @param time 대화 시간
 * @returns
 */
export default function Bubble({ text, speaker, time }: IBubbleProps) {
  const [isTime, setIsTime] = useState<string>("");
  // 현재 시간을 담는 state

  /**
   * 생성 시 시간으로 들어온 값을 dateFormatter 로 시간을 오전/오후로 변환
   */
  useEffect(() => {
    dateFormatter(time, setIsTime);
  }, []);

  return (
    <div
      className={`flex justify-end p-4 pb-0 w-full gap-2 ${
        speaker ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="flex flex-col justify-end items-center">
        <h2 className="text-xs">{isTime}</h2>
      </div>

      <div
        className={`p-4 rounded-lg relative ${
          speaker
            ? "bg-themePurple text-slate-200"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        <div
          className={`absolute top-0  w-4 h-2 ${
            speaker
              ? "bg-themePurple text-slate-200 -right-2"
              : "bg-slate-200 text-slate-700 -left-2"
          } left-cut`}
          style={{
            clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
          }}
        />
        <p className="break-all w-fit max-w-xs">{text}</p>
      </div>
    </div>
  );
}
