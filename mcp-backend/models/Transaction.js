const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    pickupPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupPartner",
        required: [true, "Pickup partner is required"],
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0, "Transaction amount cannot be negative"],
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: [true, "Transaction type is required"],
        trim: true,
    },
    referenceId: {
        type: String,
        unique: true,
        default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model("Transaction", transactionSchema);
