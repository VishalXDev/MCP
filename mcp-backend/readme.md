<!-- 🚀 MCP (Meal Coordination Platform) System
📌 Project Overview
MCP (Meal Coordination Platform) is a hospital food delivery management system designed to streamline food order processing, tracking, and delivery. The platform includes:

Hospital Food Manager Dashboard to manage meals and delivery assignments

Inner Pantry Staff Dashboard to track and prepare food requests

Delivery Personnel Dashboard to handle food distribution efficiently

Real-time Order Tracking & Notifications

Payment Integration using Razorpay

Google Maps API for Delivery Tracking

🛠️ Tech Stack
🔹 Frontend:
React.js (Vite)

Tailwind CSS / Material UI

React Router

Axios for API Calls

🔹 Backend:
Node.js (NestJS)

Prisma ORM

PostgreSQL / MongoDB

Express.js

JWT Authentication

🔹 Other Integrations:
Payment Gateway: Razorpay

Maps & Tracking: Google Maps API

Notifications: Web & Email Alerts

🎯 Features & Functionality
✅ Frontend (React.js)
Authentication & Authorization

Login/Register for different user roles (Admin, Pantry Staff, Delivery Personnel).

Order Management System

View, create, and update meal orders.

Assign delivery personnel to orders.

Real-Time Order Tracking

View delivery progress using Google Maps API.

Payments & Transactions

Secure payments using Razorpay.

Dashboard & Analytics

Overview of order statuses, deliveries, and revenue metrics.

✅ Backend (NestJS + PostgreSQL/MongoDB)
User Role Management

Admin: Manage orders, users, payments.

Pantry Staff: Process meal requests.

Delivery Personnel: Handle meal deliveries.

Secure API Endpoints

Authentication using JWT tokens.

CRUD operations for users, orders, and deliveries.

Database & ORM

PostgreSQL/MongoDB with Prisma ORM.

Payment Processing

Razorpay API integration for secure payments.

Notification System

Web-based notifications for order updates.

🚀 Installation & Setup
🔹 Frontend (React.js)
sh
Copy
Edit
git clone https://github.com/VishalXDev/MCP.git
cd mcp-frontend
npm install
npm run dev
Visit http://localhost:5173/

🔹 Backend (NestJS + PostgreSQL/MongoDB)
sh
Copy
Edit
cd mcp-backend
npm install
npm run start
API runs on http://localhost:5000/

Note: Make sure to create a .env file and add your API keys for Razorpay, Google Maps, and database connections.

🎥 Demo Video
🔗 Click here to watch the demo (Upload to Google Drive/YouTube & add the link)

📜 License
This project is open-source and available under the MIT License.

✨ Contributors
👤 Vishal Dwivedy – LinkedIn -->