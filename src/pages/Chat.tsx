import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Bubble from "../components/Bubble";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { BubbleList } from "../jsons/dummy";
import Hood from "../components/Hood";

interface IChatProps {
  message: string;
  speaker: boolean;
}

export default function Chat() {
  const [isChat, setIsChat] = useState<IChatProps[]>(BubbleList);
  const { roomId } = useParams();
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isChat]);

  const onValid = (data: { message: string }) => {
    console.log(data.message);
    setIsChat([...isChat, { message: data.message, speaker: true }]);
    reset();
  };

  return (
    <div className="min-h-screen flex w-full flex-col justify-start">
      <Hood title={` 님과의 채팅`} />
      <div className="relative  z-20">
        {/* other-user */}
        <div className="fixed w-full bg-violet-100 border-b transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-violet-50">
          <div className="flex flex-row justify-between w-auto gap-4">
            <div className="h-16 w-16 bg-violet-200 rounded-3xl" />
            <div className="flex flex-col justify-around">
              <b className="text-slate-700 text-md">이준모</b>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-violet-300  custom-max-h pt-20 pb-4">
        {isChat.map((bubble, index) => (
          <Bubble key={index} text={bubble.message} speaker={bubble.speaker} />
        ))}
      </div>

      <div
        ref={chatRef}
        className="w-full h-24 bg-violet-100 flex flex-col justify-center items-center"
      >
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("message", {
              required: "채팅 내용을 입력하세요.",
            })}
            type="text"
            id="message"
            name="message"
          />
        </form>
      </div>
    </div>
  );
}
