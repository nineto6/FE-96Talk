import { useEffect, useState } from "react";
import dateFormatter from "../utils/formatter";

interface IBubbleProps {
  text: string;
  speaker: boolean;
  time: string;
  //   말하는 사람이 본인인지
}

export default function Bubble({ text, speaker, time }: IBubbleProps) {
  const [isTime, setIsTime] = useState<string>("");
  const [current, setCurrent] = useState<string>("");

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
