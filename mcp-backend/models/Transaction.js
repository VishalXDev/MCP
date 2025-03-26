const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    pickupPartner: { type: mongoose.Schema.Types.ObjectId, ref: "PickupPartner" },
    amount: Number,
    type: { type: String, enum: ["credit", "debit"] },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
