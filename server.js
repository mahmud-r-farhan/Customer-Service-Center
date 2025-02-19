const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const clientRoutes = require("./routes/clients")
const WebSocket = require('ws')

dotenv.config()

const app = express()

app.use(cors({
  origin: (process.env.frontendURL),
  credentials: true
}))
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/clients", clientRoutes)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Initialize WebSocket server
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  console.log('New client connected')

  ws.on('message', (message) => {
    const data = JSON.parse(message)
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})