





const dns = require("dns");

// MongoDB Atlas DNS SRV fix
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 TaskFlow Backend Running Successfully"
    });
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectDB();

// Server Start
app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});