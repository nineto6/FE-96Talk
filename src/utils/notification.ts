import { useEffect, useState } from "react";
import { globalConfig } from "./globals";
import { isMobile } from "react-device-detect";

export async function requestNotification() {
  // 현재 알림 권한 상태 확인
  if (!isMobile) {
    let permission = Notification.permission;

    // 권한이 거부되었거나 아직 결정되지 않은 경우, 권한 요청
    if (permission === "denied" || permission === "default") {
      permission = await Notification.requestPermission();
    }

    return permission;
  }
}

export const useGlobalAlertCounter = () => {
  const [counter, setCounter] = useState(globalConfig.isAlertCounter);

  useEffect(() => {
    const interval = setInterval(() => {
      if (globalConfig.isAlertCounter !== counter) {
        setCounter(globalConfig.isAlertCounter);
      }
    }, 500); // 1초마다 확인

    return () => clearInterval(interval);
  }, [counter]);

  return counter;
};
