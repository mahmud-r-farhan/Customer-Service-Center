import { updateClients, setCurrentClient, updateSingleClient } from "./clientsSlice";

let socket = null;
let reconnectAttempts = 0;
let reconnectTimer = null;

function connect(store) {
  const url = import.meta.env.VITE_WS_URL;
  if (!url) {
    console.error('WS URL missing (VITE_WS_URL)');
    return;
  }
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    socket = new WebSocket(url);
  } catch (e) {
    console.error('WS create error:', e);
    scheduleReconnect(store);
    return;
  }

  socket.onopen = () => {
    reconnectAttempts = 0;
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

  const handleCloseOrError = (label, evt) => {
    console.warn(`WS ${label}`);
    socket = null;
    scheduleReconnect(store);
  };

  socket.onclose = (e) => handleCloseOrError('disconnected', e);
  socket.onerror = (e) => handleCloseOrError('error', e);
}

function scheduleReconnect(store) {
  if (reconnectTimer) return;
  const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
  reconnectAttempts++;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect(store);
  }, delay);
}

export const websocketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'ws/connect') {
    connect(store);
  }
  if (action.type === 'ws/disconnect') {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (socket) {
      try { socket.close(); } catch {}
      socket = null;
    }
  }
  return next(action);
};

export const sendWSMessage = (message) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};