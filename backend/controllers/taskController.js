
const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Todo",
      priority: req.body.priority || "Medium",
      dueDate: req.body.dueDate,
      project: req.body.project,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tasks of Logged-in User
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).populate("project", "title");

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("project", "title");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        project: req.body.project,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("project", "title");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task Not Found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};