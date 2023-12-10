import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Bubble from "../components/Bubble";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { BubbleList } from "../jsons/dummy";
import Hood from "../components/Hood";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { globalConfig } from "../utils/globals";
import SockJS from "sockjs-client";
import { getProfileData } from "../apis/apis";

interface IChatProps {
  message: string;
  speaker: boolean;
}

export default function Chat() {
  const [isChat, setIsChat] = useState<IChatProps[]>([]);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { chatroomChannelId } = useParams();
  const nav = useNavigate();

  let client = useRef<CompatClient>();

  const onValid = (data: { message: string }) => {
    // console.log(data.message);
    // setIsChat([...isChat, { message: data.message, speaker: true }]);
    publish(data.message);

    reset();
  };

  const connectHandler = async () => {
    const token = globalConfig.isToken;
    client.current = Stomp.over(() => {
      const sock = new SockJS(`https://nineto6.p-e.kr/api/ws`);
      return sock;
    });

    // console.log(token);

    client.current.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        client.current?.subscribe(`/sub/chat/${chatroomChannelId}`, (body) => {
          console.log(body);
        });
      },
      () => {
        // error 로직
        // alert("error");
        nav("/");
      }
    );

    client.current.onStompError = (frame) => {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };
  };

  const publish = (chat: string) => {
    client.current?.publish({
      destination: "/pub/chat",
      body: JSON.stringify({
        channelId: chatroomChannelId,
        message: chat,
        writerNickname: "",
      }),
    });
  };

  useEffect(() => {
    const connection = async () => {
      await getProfileData().then((response) => {
        if (response.status === 200 && response.data?.status === 200) {
          connectHandler();
        }
      });
    };

    connection();

    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isChat]);

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
