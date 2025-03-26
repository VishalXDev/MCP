const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    pickupPartner: { type: mongoose.Schema.Types.ObjectId, ref: "PickupPartner" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    amount: Number,
    location: String,
});

module.exports = mongoose.model("Order", OrderSchema);
