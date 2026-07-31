
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

// =========================
// Admin Dashboard
// =========================
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();

    const pendingTasks = await Task.countDocuments({
      status: { $in: ["Todo", "In Progress"] },
    });

    const completedTasks = await Task.countDocuments({
      status: "Done",
    });

    res.status(200).json({
      totalUsers,
      totalProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Users
// =========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Projects
// =========================
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "user",
      "name email"
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error("Projects Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Tasks
// =========================
const getAllTasks = async (req, res) => {
  try {
    console.log("✅ Admin Task API Called");

    const tasks = await Task.find()
      .populate("project", "title description")
      .populate("user", "name email");

    console.log("Total Tasks:", tasks.length);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Tasks Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getAllProjects,
  getAllTasks,
};