import { updateClients, setCurrentClient } from "./clientsSlice";

let socket = null;

export const websocketMiddleware = (store) => (next) => (action) => {
  if (action.type === "ws/connect") {
    // Connect to WebSocket server
  
    socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "CLIENTS_UPDATE":
          store.dispatch(updateClients(data.payload));
          break;
        case "CLIENT_ASSIGNED":
          store.dispatch(setCurrentClient(data.payload));
          break;
        // Add more cases as needed
      }
    };
  }

  if (action.type === "ws/disconnect" && socket) {
    socket.close();
  }

  return next(action);
};

export const sendWSMessage = (message) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};