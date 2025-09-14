const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ["upcoming", "done"], default: "upcoming" },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);