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
clientSchema.index({ status: 1, createdAt: 1 });

// Enforce token uniqueness only among active (queued/consulting) clients so that
// completed tokens can be safely reused. This closes a race condition where two
// concurrent requests could otherwise be assigned the same active token.
clientSchema.index(
  { token: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["queued", "consulting"] } },
  }
);

module.exports = mongoose.model("Client", clientSchema);