import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Blog from "./models/Blog.js";

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration for production (replace with your actual frontend domain)
const allowedOrigins = [
  "https://portfolio-xi-fawn-51.vercel.app",
  "http://localhost:5173" // Optional for local testing
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};
connectDB();

// Routes
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ error: "Failed to create blog" });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update blog" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete blog" });
  }
});

// Port setup for production
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
