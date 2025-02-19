const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ["upcoming", "done"], default: "upcoming" },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Client", clientSchema)

