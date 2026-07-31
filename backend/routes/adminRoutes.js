
const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAllUsers,
  getAllProjects,
  getAllTasks
} = require("../controllers/adminController");


// Admin Dashboard Stats
router.get("/dashboard", getAdminDashboard);


// Get All Users
router.get("/users", getAllUsers);


// Get All Projects
router.get("/projects", getAllProjects);


// Get All Tasks
router.get("/tasks", getAllTasks);


module.exports = router;