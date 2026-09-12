const express = require("express");
const mongoose = require("mongoose");
const Client = require("../models/Client");
const auth = require("../middleware/auth");
const { broadcast } = require("../websocket");

const router = express.Router();

const VALID_STATUSES = ["queued", "consulting", "done"];

router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, number } = req.body;
    if (!name || !number || typeof name !== "string" || typeof number !== "string") {
      return res.status(400).json({ message: "Valid name and number are required" });
    }

    const trimmedName = name.trim();
    const trimmedNumber = number.trim();

    if (!trimmedName || !trimmedNumber) {
      return res.status(400).json({ message: "Name and number cannot be empty" });
    }

    // Generate unique token server-side
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let savedClient = null;
    let attempts = 0;
    const maxAttempts = 2600; // 26*100

    while (!savedClient && attempts < maxAttempts) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const num = Math.floor(Math.random() * 100).toString().padStart(2, "0");
      const candidateToken = `${letter}${num}`;

      // Check if token is already used by active clients
      const existingActive = await Client.findOne({
        token: candidateToken,
        status: { $in: ["queued", "consulting"] }
      });

      if (!existingActive) {
        try {
          // Try to save with this token
          const client = new Client({ name: trimmedName, number: trimmedNumber, token: candidateToken, status: "queued" });
          await client.save();
          savedClient = client;
          break;
        } catch (saveError) {
          if (saveError.code === 11000) {
            console.log(`Token ${candidateToken} taken concurrently, retrying...`);
          } else {
            throw saveError;
          }
        }
      }
      attempts++;
    }

    if (!savedClient) {
      return res.status(500).json({ message: "No available tokens. Please try again later." });
    }

    // Broadcast update after successful save
    broadcast({ type: "CLIENTS_UPDATE", payload: await Client.find() });
    // Return the full client document (including _id, status, createdAt, etc.)
    // so the frontend can render it immediately without waiting on the
    // WebSocket broadcast to fill in missing fields.
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ message: error.message || "Failed to add client" });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client id" });
    }

    const { status, agent } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = { status };
    if (agent !== undefined) updateData.agent = agent;
    if (status === "consulting") {
      updateData.consultationStart = new Date();
    }

    const client = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    broadcast({ type: "CLIENT_STATUS_UPDATED", payload: client });
    broadcast({ type: "CLIENTS_UPDATE", payload: await Client.find() });
    res.json(client);
  } catch (error) {
    console.error("Error updating client status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check-token/:token", auth, async (req, res) => {
  try {
    const { token } = req.params;
    if (!/^[A-Z][0-9]{2}$/.test(token)) {
      return res.status(400).json({ message: "Invalid token format" });
    }
    const client = await Client.findOne({ 
      token, 
      status: { $in: ["queued", "consulting"] }
    });
    res.json({ isAvailable: !client });
  } catch (error) {
    console.error("Error checking token:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/next-available-token", auth, async (req, res) => {
  try {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const activeClients = await Client.find({ 
      status: { $in: ["queued", "consulting"] } 
    }, { token: 1 });
    
    const activeTokens = new Set(activeClients.map(client => client.token));
    
    for (let letterIndex = 0; letterIndex < letters.length; letterIndex++) {
      const letter = letters[letterIndex];
      
      for (let num = 0; num < 100; num++) {
        const number = num.toString().padStart(2, "0");
        const token = `${letter}${number}`;
        
        if (!activeTokens.has(token)) {
          return res.json({ token, isAvailable: true });
        }
      }
    }
    
    res.json({ token: null, isAvailable: false });
  } catch (error) {
    console.error("Error finding available token:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Use DELETE (not GET) since this endpoint mutates data by removing old records.
router.delete("/recycle-tokens", auth, async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleted = await Client.deleteMany({
      status: "done",
      updatedAt: { $lt: oneDayAgo }
    });

    if (deleted.deletedCount > 0) {
      broadcast({ type: "CLIENTS_UPDATE", payload: await Client.find() });
    }

    res.json({ message: "Tokens recycled successfully", deletedCount: deleted.deletedCount });
  } catch (error) {
    console.error("Error recycling tokens:", error);
    res.status(500).json({ message: "Error recycling tokens" });
  }
});

module.exports = router;