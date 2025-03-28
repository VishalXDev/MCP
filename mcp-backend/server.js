const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());
const orderRoutes = require('./routes/orderRoutes');
// / After other middleware
app.use('/api/partners', partnerRoutes);

mongoose.connect("mongodb://localhost:27017/mcp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample Wallet Schema
const Wallet = mongoose.model("Wallet", {
  userId: String,
  balance: Number,
  transactions: Array,
});

// 🟢 GET Wallet Route (Fix for 404 error)
app.get("/mcp/wallet", async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Sample Orders Schema
const Order = mongoose.model("Order", {
  orderId: String,
  partnerId: String,
  status: String,
  lat: Number,
  lng: Number,
});

// 🟢 GET Orders (with Locations)
app.get("/mcp/orders-with-locations", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders.map(({ orderId, partnerId, status }) => ({
      orderId,
      partnerId,
      status,
    }))); // 🔴 Removed lat/lng to prevent map rendering
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
