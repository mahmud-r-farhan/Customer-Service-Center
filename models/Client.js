const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ["queued", "consulting", "done"], default: "queued" },
  agent: { type: String, default: null },
  consultationStart: { type: Date, default: null },
}, { timestamps: true });

// Indexes for common queries
clientSchema.index({ token: 1 });
clientSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model("Client", clientSchema);