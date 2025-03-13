import { io } from "socket.io-client";

// Force the client to use polling only to avoid WebSocket upgrade issues.
const socket = io(process.env.REACT_APP_SOCKET_URL || "https://chatveda.onrender.com", {
  transports: ["polling"]
});

const SocketService = {
  getSocket: () => socket,
};

export default SocketService;
