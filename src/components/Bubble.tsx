import { useEffect, useState } from "react";

interface IBubbleProps {
  text: string;
  speaker: boolean;
  time: string;
  //   말하는 사람이 본인인지
}

export default function Bubble({ text, speaker, time }: IBubbleProps) {
  const [isTime, setIsTime] = useState<string>("");

  const formatNumber = (number: number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  useEffect(() => {
    const currentTime = new Date();
    const [year, month, day] = time.split("T")[0].split("-").map(Number);
    const [hour, min, sec] = time.split("T")[1].split(":").map(Number);

    if (currentTime.getFullYear() !== year) {
      setIsTime(`${year}/${month}/${day}`);
    } else if (
      currentTime.getMonth() + 1 !== month ||
      currentTime.getDate() !== day
    ) {
      setIsTime(`${month}/${day}`);
    } else {
      // 같은 날짜 일 때
      if (hour < 12) {
        setIsTime(`오전 ${formatNumber(hour)}:${formatNumber(min)}`);
      } else if (12 <= hour) {
        setIsTime(`오후 ${formatNumber(hour - 12)}:${formatNumber(min)}`);
      }
    }

    console.log(currentTime.getMonth());
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
