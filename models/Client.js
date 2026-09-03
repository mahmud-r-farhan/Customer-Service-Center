const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  token: { type: String, required: true, trim: true },
  status: { type: String, enum: ["queued", "consulting", "done"], default: "queued" },
  agent: { type: String, default: null },
  consultationStart: { type: Date, default: null },
}, { timestamps: true });

// Indexes for performance and token lookups
clientSchema.index({ token: 1, status: 1 });
clientSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model("Client", clientSchema);