import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://chatapp-serverside.up.railway.app";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});
