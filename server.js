// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Enable CORS for all devices
app.use(cors({ origin: "*" }));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Contact Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Test GET route
app.get("/api/contact", (req, res) => {
  res.send("API is live. Use POST /api/contact to save messages.");
});

// POST Contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, department, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }

    const newMessage = new Message({ name, email, department, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message saved successfully!" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// User API routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
