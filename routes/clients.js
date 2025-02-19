const express = require("express")
const Client = require("../models/Client")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 })
    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", auth, async (req, res) => {
  try {
    const { name, number, token } = req.body
    const client = new Client({ name, number, token })
    await client.save()
    res.status(201).json(client)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body
    const client = await Client.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body
    if (!status || !['upcoming', 'done'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" })
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    )
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    
    res.json(client)
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router