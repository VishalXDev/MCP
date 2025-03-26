const mongoose = require("mongoose");

const PickupPartnerSchema = new mongoose.Schema({
    name: String,
    email: String,
    walletBalance: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("PickupPartner", PickupPartnerSchema);
