const WebSocket = require("ws");

let wss;

function initWebSocket(server) {
  wss = new WebSocket.Server({ server, perMessageDeflate: false });

  wss.on("connection", (ws) => {
    ws.isAlive = true;
    console.log("New client connected");

    ws.on("pong", () => (ws.isAlive = true));

    ws.on("close", () => console.log("Client disconnected"));
    ws.on("error", (err) => console.error("WS error:", err));

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        broadcast(data);
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    });
  });

  // Ping/pong to keep alive
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
}

function broadcast(data) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { initWebSocket, broadcast };