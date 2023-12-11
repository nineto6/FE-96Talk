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
import { getChatList, getProfileData, getProfileImage } from "../apis/apis";
import { IUserProps } from "./User";
import ChatTopBar from "../components/ChatTopBar";
import Loading from "../components/Loading";

interface IChatProps {
  channelId: string;
  message: string;
  regdate: string;
  writerNickname: string;
}

interface IChatroomProps {
  chatroomChannelId: string;
  profileResponseList: IUserProps[];
}

export default function Chat() {
  const [isName, setIsName] = useState<string>("");
  const [isChat, setIsChat] = useState<IChatProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPartner, setIsPartner] = useState<IUserProps[]>([
    {
      memberNickname: "",
      imageName: null,
      profileStateMessage: "",
      type: null,
    },
  ]);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { chatroomChannelId } = useParams();
  const nav = useNavigate();

  let client = useRef<CompatClient>();

  const onValid = (data: { message: string }) => {
    publish(data.message);
    reset();
  };

  const connectHandler = async () => {
    const token = globalConfig.isToken;

    client.current = Stomp.over(() => {
      const sock = new SockJS(`https://nineto6.p-e.kr/api/ws`);
      return sock;
    });

    client.current.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        client.current?.subscribe(
          `/sub/chat/${chatroomChannelId}`,
          (body) => {
            // console.log(JSON.parse(body.body));
            setIsChat((current) => {
              return [...current, JSON.parse(body.body)];
            });
          },
          { Authorization: `Bearer ${token}` }
        );
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
    const token = globalConfig.isToken;

    client.current?.publish({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      destination: "/pub/chat",
      body: JSON.stringify({
        channelId: chatroomChannelId,
        message: chat,
        writerNickname: isName,
      }),
    });
  };

  useEffect(() => {
    const connection = async () => {
      await getProfileData().then((response) => {
        if (response.status === 200 && response.data?.status === 200) {
          // console.log(response);
          setIsName(response.data.result.memberNickname);
          connectHandler();
        }
      });

      await getChatList()
        .then((response: any) => {
          // console.log(response);
          if (response.status === 200 && response.data?.status === 200) {
            response.data.result.map((chatroom: IChatroomProps) => {
              if (chatroom.chatroomChannelId === chatroomChannelId) {
                // 일치하는 방을 찾았을 경우
                setIsPartner(chatroom.profileResponseList);
              }
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    connection();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isChat]);

  return (
    <div className="min-h-screen flex w-full flex-col justify-start">
      {isLoading && <Loading />}
      <Hood
        title={`${isPartner.map(
          (partner) => partner.memberNickname
        )} 님과의 채팅`}
      />
      <div className="relative  z-20">
        {/* other-user */}
        <div className="fixed w-full bg-violet-100 border-b transition-colors px-4 h-auto bg-transparent flex flex-row justify-between items-center gap-6 pt-2 pb-2 border-violet-50">
          <ChatTopBar isPartner={isPartner} setIsLoading={setIsLoading} />
        </div>
      </div>
      <div className="bg-violet-300  custom-max-h pt-20 pb-4">
        {isChat.map((bubble, index) => (
          <Bubble
            key={index}
            text={bubble.message}
            time={bubble.regdate}
            speaker={bubble.writerNickname === isName ? true : false}
          />
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
