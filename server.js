import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// ========================
// 🔹 Middleware
// ========================
app.use(cors());
app.use(express.json());

// ========================
// 🔹 MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ========================
// 🔹 Schemas & Models
// ========================

// Contact Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// ========================
// 🔹 Routes
// ========================

// 📩 Contact Form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, department, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMsg = new Message({ name, email, department, message });
    await newMsg.save();

    res.json({ success: true, msg: "Message saved successfully" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 👤 Users API (from routes/user.js)
import userRoutes from "./routes/user.js";
app.use("/api/users", userRoutes);

// ========================
// 🔹 Start Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
