export async function requestNotification() {
  // 현재 알림 권한 상태 확인
  let permission = Notification.permission;

  // 권한이 거부되었거나 아직 결정되지 않은 경우, 권한 요청
  if (permission === "denied" || permission === "default") {
    permission = await Notification.requestPermission();
  }

  return permission;
}
