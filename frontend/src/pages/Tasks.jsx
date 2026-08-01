
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/tasks.css";

import { getProjects } from "../services/projectService";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";


function Tasks() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");


  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");

  const [dueDate, setDueDate] = useState("");

  const [selectedProject, setSelectedProject] = useState("");

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");




  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);

  // Load Tasks
  const loadTasks = async () => {
    try {
      if (user?.role === "admin") {
        const res = await axios.get(
          "https://taskflowbackend-qhqg.onrender.com/api/admin/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(res.data);
      } else {
        const res = await getTasks();
        if (res.data.tasks) {
          setTasks(res.data.tasks);
        } else {
          setTasks(res.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Load Projects
  const loadProjects = async () => {
    try {
      const res = await getProjects();
      if (res.data.projects) {
        setProjects(res.data.projects);
        if (res.data.projects.length > 0) {
          setSelectedProject(res.data.projects[0]._id);
        }
      } else {
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProject(res.data[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTasks();
    if (user?.role !== "admin") {
      loadProjects();
    }
  }, []);

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    setEditId(null);
    setShowForm(false);
  };

  const addTask = async () => {
    if (!title || !description || !selectedProject || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate,
        project: selectedProject,
      };

      if (editId) {
        await updateTask(editId, taskData);
        alert("Task Updated Successfully ✅");
      } else {
        await createTask(taskData);
        alert("Task Added Successfully ✅");
      }

      clearForm();
      loadTasks();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : "");

    if (task.project) {
      setSelectedProject(task.project._id || task.project);
    }

    setEditId(task._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const removeTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (task) => {
    let newStatus = "Todo";

    if (task.status === "Todo" || task.status === "Pending") {
      newStatus = "In Progress";
    } else if (task.status === "In Progress") {
      newStatus = "Done";
    } else if (task.status === "Done" || task.status === "Completed") {
      newStatus = "Todo";
    }

    try {
      await updateTask(task._id, {
        status: newStatus,
      });
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusClass = (st) => {
    const s = (st || "").toLowerCase();
    if (s === "done" || s === "completed") return "done";
    if (s === "in progress") return "in-progress";
    return "todo";
  };

  const getPriorityClass = (p) => {
    const prio = (p || "").toLowerCase();
    if (prio === "high") return "high";
    if (prio === "medium") return "medium";
    return "low";
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filterStatus === "All") return matchesSearch;
    if (filterStatus === "Todo") {
      return (
        matchesSearch &&
        (task.status === "Todo" || task.status === "Pending")
      );
    }
    if (filterStatus === "In Progress") {
      return matchesSearch && task.status === "In Progress";
    }
    if (filterStatus === "Done") {
      return (
        matchesSearch &&
        (task.status === "Done" || task.status === "Completed")
      );
    }
    return matchesSearch;
  });

  return (
    <div className="tasks-page">
      <Sidebar />

      <div className="tasks-content">
        <div className="tasks-header">
          <div>
            <h1>📝 Manage Tasks</h1>
            <p className="tasks-subtitle">
              {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="header-right-tools">
            <input
              className="search-box"
              placeholder="🔍 Search Tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {user?.role !== "admin" && (
              <button
                className="toggle-form-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✕ Close Form" : "➕ New Task"}
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {["All", "Todo", "In Progress", "Done"].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filterStatus === tab ? "active" : ""}`}
              onClick={() => setFilterStatus(tab)}
            >
              {tab === "All" && "📂 All"}
              {tab === "Todo" && "⏳ To Do"}
              {tab === "In Progress" && "🔄 In Progress"}
              {tab === "Done" && "✅ Done"}
            </button>
          ))}
        </div>

        {/* Task Form */}
        {user?.role !== "admin" && showForm && (
          <div className="task-form animated-form">
            <h3>{editId ? "✏ Edit Task" : "➕ Create New Task"}</h3>
            <input
              placeholder="Task Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Task Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="form-row">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    📁 {project.title}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Todo">⏳ Todo</option>
                <option value="In Progress">🔄 In Progress</option>
                <option value="Done">✅ Done</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>

            <div className="form-row">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <div className="form-actions">
                <button className="task-btn primary" onClick={addTask}>
                  {editId ? "💾 Save Changes" : "✨ Create Task"}
                </button>
                {editId && (
                  <button className="task-btn cancel" onClick={clearForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Grid */}
        <div className="task-grid">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <span>📝</span>
              <h3>No tasks found</h3>
              <p>Try searching for something else or create a new task!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div className="task-card-header">
                  <h3>{task.title}</h3>
                  <span
                    className={`priority-badge ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </div>

                <p className="task-desc">{task.description}</p>

                <div className="task-meta">
                  <span>
                    📁 <strong>Project:</strong> {task.project?.title || "General"}
                  </span>
                  {task.dueDate && (
                    <span>
                      📅 <strong>Due:</strong>{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="task-footer">
                  <span
                    className={`status-badge ${getStatusClass(task.status)}`}
                    onClick={() => changeStatus(task)}
                    title="Click to cycle status"
                  >
                    {task.status} 🔄
                  </span>

                  {user?.role !== "admin" && (
                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={() => editTask(task)}
                        title="Edit task"
                      >
                        ✏
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => removeTask(task._id)}
                        title="Delete task"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;

