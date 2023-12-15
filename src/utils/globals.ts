import { CompatClient } from "@stomp/stompjs";

export let globalConfig = {
  isToken: null,
};

export let stompClient = {
  instance: null as CompatClient | null,
  isConnect: false,
};
