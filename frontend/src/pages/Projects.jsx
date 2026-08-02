import { useEffect, useState } from "react";
import axios from "axios";
import { FolderKanban, Plus, Search, Edit2, Trash2, LayoutGrid, List, X, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import { CardSkeleton } from "../components/SkeletonLoader";
import { useToast } from "../context/ToastContext";
import "../styles/projects.css";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

function Projects() {
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Confirm Delete State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      if (user?.role === "admin") {
        const res = await axios.get(
          "https://taskflowbackend-qhqg.onrender.com/api/admin/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await getProjects();
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Project Error:", error);
      showToast("Failed to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      if (editId) {
        await updateProject(editId, { title, description });
        showToast("Project updated successfully!", "success");
      } else {
        await createProject({ title, description });
        showToast("New project created successfully!", "success");
      }

      closeModal();
      loadProjects();
    } catch (error) {
      console.error(error);
      showToast("Operation failed. Try again.", "error");
    }
  };

  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setEditId(project._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
    setEditId(null);
  };

  const confirmDeleteProject = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTargetId);
      showToast("Project deleted successfully", "success");
      setDeleteTargetId(null);
      loadProjects();
    } catch (err) {
      showToast("Failed to delete project", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="projects-layout">
      <Sidebar />

      <main className="projects-main">
        {/* Header Bar */}
        <header className="projects-header-bar">
          <div>
            <h1>📁 Manage Projects</h1>
            <p className="subtitle">{projects.length} Active Workspace Projects</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                <Plus size={16} /> Create Project
              </button>
            )}
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : (
          /* Project Grid/List View */
          <div className={`projects-container ${viewMode}`}>
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="card-top">
                  <div className="project-icon-badge">
                    <FolderKanban size={20} />
                  </div>
                  <h3>{project.title}</h3>
                </div>

                <p className="project-desc">{project.description}</p>

                {user?.role === "admin" && project.user && (
                  <div className="creator-badge">
                    <User size={13} /> {project.user.name} ({project.user.email})
                  </div>
                )}

                {user?.role !== "admin" && (
                  <div className="card-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(project)}
                      title="Edit project"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => setDeleteTargetId(project._id)}
                      title="Delete project"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="empty-projects">
                <FolderKanban size={48} />
                <h3>No Projects Found</h3>
                <p>Create a new project or try searching for another term.</p>
                {user?.role !== "admin" && (
                  <button className="primary-btn" onClick={openCreateModal}>
                    <Plus size={16} /> Create First Project
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
                <h3>{editId ? "✏ Edit Project" : "✨ Create New Project"}</h3>
                <button className="close-icon-btn" onClick={closeModal}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="modal-form">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Mobile App Redesign"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    placeholder="Brief details about project goals and deliverables..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="form-actions-row">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn">
                    {editId ? "Save Changes" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTargetId}
          title="Delete Project"
          message="Are you sure you want to delete this project? Associated tasks may also be affected."
          confirmText="Yes, Delete Project"
          isLoading={isDeleting}
          onConfirm={confirmDeleteProject}
          onCancel={() => setDeleteTargetId(null)}
        />
      </main>
    </div>
  );
}

export default Projects;
