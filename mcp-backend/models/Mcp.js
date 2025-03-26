const mongoose = require("mongoose");

const McpSchema = new mongoose.Schema({
    name: String,
    email: String,
    walletBalance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Mcp", McpSchema);
