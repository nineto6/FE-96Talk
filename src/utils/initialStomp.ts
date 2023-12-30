import { Stomp } from "@stomp/stompjs";
import { globalConfig, stompClient } from "./globals";
import SockJS from "sockjs-client";
import { isMobile } from "react-device-detect";

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
        `/sub/alert/${memberNickname}`,
        (response) => {
          console.log(JSON.parse(response.body));
          const { channelId, message, regdate, writerNickname } = JSON.parse(
            response.body
          );
          if (!isMobile && Notification.permission === "granted") {
            new Notification(`${writerNickname}`, {
              body: `${message}`,
            }); // 여기서 body를 사용하여 시스템 알림 생성
          }

          globalConfig.isAlertCounter += 1;
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
