require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

/* ====================================================
   ✅ Data Storage (Temporary In-Memory Database)
   ==================================================== */
let partnerLocations = {}; // Live locations of pickup partners
let transactions = []; // Wallet transactions
let orders = []; // Active orders
let completedOrders = []; // Completed orders history

/* ====================================================
   ✅ Email Notification System (Mailtrap Config)
   ==================================================== */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Email Notification
const sendEmailNotification = (to, subject, message) => {
  const mailOptions = {
    from: `"MCP System" <${process.env.EMAIL_USER}>`, 
    to,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("❌ Email error:", err);
    else console.log("✅ Email sent:", info.response);
  });
};

// ✅ API: Send Order Notification via Email
app.post("/send-order-email", (req, res) => {
  const { email, orderId, status } = req.body;
  if (!email || !orderId || !status) return res.status(400).json({ success: false, message: "Missing data" });

  sendEmailNotification(email, `Order ${orderId} Update`, `Your order ${orderId} is now ${status}.`);
  res.json({ success: true, message: "Email sent successfully!" });
});

/* ====================================================
   ✅ Order Management APIs
   ==================================================== */

// ✅ Auto-Assign Order to Nearest Partner
const assignOrder = (orderId, orderLocation) => {
  let nearestPartner = null;
  let minDistance = Infinity;

  Object.entries(partnerLocations).forEach(([partnerId, partnerLoc]) => {
    const distance = Math.sqrt(
      Math.pow(orderLocation.lat - partnerLoc.lat, 2) +
      Math.pow(orderLocation.lng - partnerLoc.lng, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestPartner = partnerId;
    }
  });

  if (!nearestPartner) return { error: "No available partners." };

  orders.push({ orderId, partnerId: nearestPartner, status: "Assigned" });
  io.emit("orderAssigned", { orderId, partnerId: nearestPartner });

  return { assignedTo: nearestPartner };
};

// ✅ API: Create Order & Auto-Assign
app.post("/create-order", (req, res) => {
  const { orderId, pickupLat, pickupLng, dropoffLat, dropoffLng } = req.body;
  if (!orderId || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng) return res.status(400).json({ success: false, message: "Missing order data" });

  const result = assignOrder(orderId, { lat: pickupLat, lng: pickupLng });

  if (result.error) return res.status(400).json({ success: false, message: result.error });

  res.json({ success: true, message: "Order assigned", assignedTo: result.assignedTo });
});

// ✅ API: Update Order Status
app.post("/update-order-status", (req, res) => {
  const { orderId, partnerId, status } = req.body;
  if (!orderId || !partnerId || !status) return res.status(400).json({ success: false, message: "Missing data" });

  const orderIndex = orders.findIndex((order) => order.orderId === orderId);

  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    io.emit("orderStatusUpdate", { orderId, status });

    if (status === "Completed") {
      completedOrders.push(orders[orderIndex]); 
      orders.splice(orderIndex, 1);
    }

    return res.json({ success: true, message: `Order updated to ${status}` });
  }

  res.status(404).json({ success: false, message: "Order not found" });
});

// ✅ Get Orders
app.get("/assigned-orders", (req, res) => res.json(orders));
app.get("/completed-orders", (req, res) => res.json(completedOrders));

/* ====================================================
   ✅ Wallet Management APIs
   ==================================================== */

// ✅ Update Wallet Balance
app.post("/update-wallet", (req, res) => {
  const { partnerId, amount, type } = req.body;
  if (!partnerId || !amount || !type) return res.status(400).json({ success: false, message: "Missing data" });

  transactions.push({ partnerId, amount, type, timestamp: new Date() });
  io.emit("walletUpdate", { partnerId, balance: amount });

  res.json({ success: true, message: "Wallet updated!" });
});

// ✅ Get Wallet Transactions
app.get("/wallet-transactions", (req, res) => res.json(transactions));

/* ====================================================
   ✅ Live Location Tracking APIs
   ==================================================== */

// ✅ Update Partner Location
app.post("/pickup/update-location", (req, res) => {
  const { partnerId, lat, lng } = req.body;
  if (!partnerId || !lat || !lng) return res.status(400).json({ success: false, message: "Missing data" });

  partnerLocations[partnerId] = { lat, lng };
  io.emit("locationUpdate", partnerLocations);

  res.json({ success: true, message: "Location updated!" });
});

// ✅ Get Orders with Locations
app.get("/orders-with-locations", (req, res) => res.json(orders));

/* ====================================================
   ✅ File Upload (Proof of Delivery)
   ==================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.post("/upload-proof", upload.fields([{ name: "image" }, { name: "signature" }]), (req, res) => {
  const { orderId, partnerId } = req.body;
  if (!orderId || !partnerId || !req.files) return res.status(400).json({ success: false, message: "Missing data" });

  const proof = {
    orderId,
    partnerId,
    imageUrl: req.files.image ? `/uploads/${req.files.image[0].filename}` : null,
    signatureUrl: req.files.signature ? `/uploads/${req.files.signature[0].filename}` : null,
    timestamp: new Date(),
  };

  console.log("Proof of Delivery Uploaded:", proof);
  res.json({ success: true, message: "Proof uploaded!", proof });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ====================================================
   ✅ Start Server
   ==================================================== */
server.listen(5000, () => console.log("✅ Server running on port 5000"));
