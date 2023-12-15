import { Stomp } from "@stomp/stompjs";
import { globalConfig, stompClient } from "./globals";
import SockJS from "sockjs-client";

export default function initialStomp(memberNickname: string) {
  const token = globalConfig.isToken;
  stompClient.instance = Stomp.over(() => {
    return new SockJS("https://nineto6.p-e.kr/api/ws");
  });

  stompClient.instance?.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      stompClient.instance?.subscribe(
        `/sub/chat/${memberNickname}`,
        (body) => {
          console.log(body);
        },
        { Authorization: `Bearer ${token}` }
      );

      stompClient.isConnect = true;
    },
    () => {
      console.log("Stomp create error.");
      stompClient.isConnect = false;
    }
  );

  stompClient.instance.onStompError = (frame: any) => {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };
}
