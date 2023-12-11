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
      <div className="flex justify-center items-center">
        <h2>{isTime}</h2>
      </div>

      <div
        className={`p-4 rounded-lg ${
          speaker
            ? "bg-themeDarkPurple text-slate-200"
            : "bg-themePurple text-slate-200"
        }`}
      >
        <p className="break-all w-fit max-w-xs">{text}</p>
      </div>
    </div>
  );
}
