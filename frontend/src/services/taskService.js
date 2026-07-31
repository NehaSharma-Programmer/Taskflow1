
import axios from "axios";

const API = "https://taskflow1-1jps.onrender.com/api/tasks";

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get All Tasks
export const getTasks = async () => {
  return await axios.get(API, config());
};

// Create Task
export const createTask = async (task) => {
  return await axios.post(API, task, config());
};

// Update Task (used for Edit + Drag & Drop)
export const updateTask = async (id, task) => {
  return await axios.put(`${API}/${id}`, task, config());
};

// Delete Task
export const deleteTask = async (id) => {
  return await axios.delete(`${API}/${id}`, config());
};