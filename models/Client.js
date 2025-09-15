const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ["queued", "consulting", "done"], default: "queued" },
  agent: { type: String, default: null },
  consultationStart: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);