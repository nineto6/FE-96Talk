import { CompatClient } from "@stomp/stompjs";

export let globalConfig = {
  isToken: null,
  isAlertCounter: 0,
};

export let stompClient = {
  instance: null as CompatClient | null,
  isConnect: false,
};
