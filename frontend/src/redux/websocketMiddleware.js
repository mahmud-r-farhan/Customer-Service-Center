import { updateClients, setCurrentClient, updateSingleClient } from "./clientsSlice";

let socket = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
// Tracks whether the disconnect was requested intentionally (e.g. logout/unmount)
// so we don't try to reconnect a socket that was closed on purpose.
let intentionalDisconnect = false;

function getWebSocketUrl() {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  // Fall back to same-origin, matching the protocol of the current page
  // (wss:// on https, ws:// on http), using the `/ws` path which the dev
  // server (see vite.config.js) and reverse proxies forward to the backend.
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  }
  return null;
}

function connect(store) {
  const url = getWebSocketUrl();
  if (!url) {
    console.error("WS URL missing (VITE_WS_URL)");
    return;
  }
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  intentionalDisconnect = false;

  try {
    socket = new WebSocket(url);
  } catch (e) {
    console.error("WS create error:", e);
    scheduleReconnect(store);
    return;
  }

  socket.onopen = () => {
    reconnectAttempts = 0;
    console.log("WS connected");
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
      console.error("WS message error:", error);
    }
  };

  const handleCloseOrError = (label) => {
    console.warn(`WS ${label}`);
    socket = null;
    if (!intentionalDisconnect) {
      scheduleReconnect(store);
    }
  };

  socket.onclose = () => handleCloseOrError("disconnected");
  socket.onerror = () => handleCloseOrError("error");
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
  if (action.type === "ws/connect") {
    connect(store);
  }
  if (action.type === "ws/disconnect") {
    intentionalDisconnect = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    reconnectAttempts = 0;
    if (socket) {
      try {
        socket.close();
      } catch (e) {
        console.warn("WS close error:", e);
      }
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
