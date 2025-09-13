const express = require("express");
const Client = require("../models/Client");
const auth = require("../middleware/auth");
const { broadcast } = require("../websocket");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error("Fetch clients error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, number, token } = req.body;
    const client = new Client({ name, number, token });
    await client.save();

    const allClients = await Client.find().sort({ createdAt: -1 });
    broadcast({ type: "CLIENTS_UPDATE", payload: allClients });

    res.status(201).json(client);
  } catch (error) {
    console.error("Add client error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["upcoming", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: "Client not found" });

    const allClients = await Client.find().sort({ createdAt: -1 });
    broadcast({ type: "CLIENTS_UPDATE", payload: allClients });
    broadcast({ type: "CLIENT_STATUS_UPDATED", payload: client });

    res.json(client);
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;