
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/projects.css";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loadProjects = async () => {
    try {
      if (user?.role === "admin") {
        const res = await axios.get(
          "https://taskflowbackend-qhqg.onrender.com/api/admin/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(res.data);
      } else {
        const res = await getProjects();
        setProjects(res.data);
      }
    } catch (error) {
      console.log("Project Error:", error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await updateProject(editId, {
          title,
          description,
        });
        alert("Project Updated Successfully ✅");
      } else {
        await createProject({
          title,
          description,
        });
        alert("Project Added Successfully ✅");
      }

      setTitle("");
      setDescription("");
      setEditId(null);
      setShowForm(false);
      loadProjects();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const removeProject = async (id) => {
    if (window.confirm("Delete this project?")) {
      await deleteProject(id);
      loadProjects();
    }
  };

  const editProject = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setEditId(project._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="projects-page">
      <Sidebar />

      <div className="projects-content">
        <div className="projects-header">
          <div>
            <h1>📁 Manage Projects</h1>
            <p className="projects-subtitle">
              {projects.length} active project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="header-right-tools">
            <input
              className="search-input"
              type="text"
              placeholder="🔍 Search Project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {user?.role !== "admin" && (
              <button
                className="toggle-form-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✕ Close Form" : "➕ New Project"}
              </button>
            )}
          </div>
        </div>

        {/* Form Card */}
        {user?.role !== "admin" && showForm && (
          <div className="form-card animated-form">
            <h3>{editId ? "✏ Edit Project" : "➕ Create New Project"}</h3>
            <input
              type="text"
              placeholder="Project Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Project Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="form-actions">
              <button className="add-btn" onClick={addProject}>
                {editId ? "💾 Save Changes" : "✨ Create Project"}
              </button>
              {editId && (
                <button
                  className="add-btn cancel"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setEditId(null);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Project Grid */}
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <div className="project-card" key={project._id}>
              <div className="project-card-header">
                <h3>📁 {project.title}</h3>
              </div>

              <p className="project-desc">{project.description}</p>

              {user?.role === "admin" && project.user && (
                <p className="creator-tag">
                  👤 <strong>Created By:</strong> {project.user.name}
                </p>
              )}

              {user?.role !== "admin" && (
                <div className="project-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editProject(project)}
                    title="Edit project"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => removeProject(project._id)}
                    title="Delete project"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="empty-state">
              <span>📁</span>
              <h3>No Projects Found</h3>
              <p>Create your first project or adjust your search filter!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
