const mongoose = require("mongoose")

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Log", logSchema)