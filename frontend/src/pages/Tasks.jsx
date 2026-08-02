import { useEffect, useState } from "react";
import axios from "axios";
import { CheckSquare, Plus, Search, Filter, Edit2, Trash2, Calendar, FolderKanban, LayoutGrid, List, X, Flame, ShieldAlert } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import { CardSkeleton } from "../components/SkeletonLoader";
import { useToast } from "../context/ToastContext";
import "../styles/tasks.css";

import { getProjects } from "../services/projectService";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Tasks() {
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Confirm Delete Modal
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      if (user?.role === "admin") {
        const res = await axios.get(
          "https://taskflowbackend-qhqg.onrender.com/api/admin/tasks",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await getTasks();
        const data = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      const projectList = Array.isArray(res.data) ? res.data : (res.data.projects || []);
      setProjects(projectList);
      if (projectList.length > 0) {
        setSelectedProject(projectList[0]._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
    if (user?.role !== "admin") {
      loadProjects();
    }
  }, []);

  const handleSaveTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Task title is required", "error");
      return;
    }

    if (user?.role !== "admin" && !selectedProject) {
      showToast("Please select a project for this task", "error");
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
        showToast("Task updated successfully!", "success");
      } else {
        await createTask(taskData);
        showToast("New task added to project!", "success");
      }

      closeModal();
      loadTasks();
    } catch (error) {
      console.error(error);
      showToast("Failed to save task. Try again.", "error");
    }
  };

  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    if (projects.length > 0) setSelectedProject(projects[0]._id);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status || "Todo");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : "");
    setSelectedProject(task.project?._id || task.project || "");
    setEditId(task._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
    setEditId(null);
  };

  const confirmDeleteTask = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteTask(deleteTargetId);
      showToast("Task deleted successfully", "success");
      setDeleteTargetId(null);
      loadTasks();
    } catch (err) {
      showToast("Failed to delete task", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      task.status === filterStatus ||
      (filterStatus === "Done" && task.status === "Completed") ||
      (filterStatus === "Todo" && task.status === "Pending");
    const matchesPriority =
      filterPriority === "All" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-layout">
      <Sidebar />

      <main className="tasks-main">
        {/* Header Bar */}
        <header className="tasks-header-bar">
          <div>
            <h1>📝 Task Workspace</h1>
            <p className="subtitle">{filteredTasks.length} tasks matched</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done / Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>

            {user?.role !== "admin" && (
              <button className="primary-btn" onClick={openCreateModal}>
                <Plus size={16} /> Add Task
              </button>
            )}
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : (
          <div className={`tasks-container ${viewMode}`}>
            {filteredTasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-card-top">
                  <span className={`status-tag ${task.status?.toLowerCase().replace(/\s+/g, "")}`}>
                    {task.status || "Todo"}
                  </span>
                  <span className={`priority-tag ${task.priority?.toLowerCase()}`}>
                    <Flame size={12} /> {task.priority || "Medium"}
                  </span>
                </div>

                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-desc">{task.description}</p>}

                <div className="task-meta-row">
                  {task.project && (
                    <span className="meta-item">
                      <FolderKanban size={14} /> {task.project.title || "Project"}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="meta-item">
                      <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {user?.role === "admin" && task.user && (
                  <div className="user-assignee-tag">
                    👤 Assignee: {task.user.name}
                  </div>
                )}

                {user?.role !== "admin" && (
                  <div className="card-actions">
                    <button className="icon-btn edit" onClick={() => openEditModal(task)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="icon-btn delete" onClick={() => setDeleteTargetId(task._id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="empty-tasks">
                <CheckSquare size={48} />
                <h3>No Tasks Found</h3>
                <p>Adjust your search filters or add a new task to your project.</p>
                {user?.role !== "admin" && (
                  <button className="primary-btn" onClick={openCreateModal}>
                    <Plus size={16} /> Add First Task
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal Dialog */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3>{editId ? "✏ Edit Task" : "➕ Add New Task"}</h3>
                <button className="close-icon-btn" onClick={closeModal}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="modal-form">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Design Landing Page Wireframe"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Add task instructions or checklist..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High Priority 🔥</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Assigned Project *</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      required
                    >
                      {projects.map((proj) => (
                        <option key={proj._id} value={proj._id}>
                          {proj.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn">
                    {editId ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTargetId}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Yes, Delete Task"
          isLoading={isDeleting}
          onConfirm={confirmDeleteTask}
          onCancel={() => setDeleteTargetId(null)}
        />
      </main>
    </div>
  );
}

export default Tasks;
