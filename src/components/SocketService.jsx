// SocketService.jsx
import { io } from "socket.io-client";

// Initialize the socket using an environment variable or fallback to your backend URL.
const socket = io(process.env.REACT_APP_SOCKET_URL || "/get_answer");

const SocketService = {
  getSocket: () => socket,
};

export default SocketService;
