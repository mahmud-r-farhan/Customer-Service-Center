import { updateClients, setCurrentClient, updateSingleClient } from "./clientsSlice";

let socket = null;

export const websocketMiddleware = (store) => (next) => (action) => {
  if (action.type === "ws/connect") {
    if (socket && socket.readyState === WebSocket.OPEN) return next(action);

    socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onopen = () => {
      console.log('WS connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "CLIENTS_UPDATE":
            store.dispatch(updateClients(data.payload));
            break;
          case "CLIENT_ASSIGNED":
            store.dispatch(setCurrentClient(data.payload));
            break;
          case "CLIENT_STATUS_UPDATED":
            store.dispatch(updateSingleClient(data.payload));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('WS message error:', error);
      }
    };

    socket.onclose = () => {
      console.log('WS disconnected');
      socket = null;
    };

    socket.onerror = (error) => {
      console.error('WS error:', error);
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