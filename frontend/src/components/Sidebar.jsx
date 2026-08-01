
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <h2 className="mobile-logo">🚀 TaskFlow</h2>
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className="sidebar-overlay open" onClick={closeMenu}></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <h2 className="logo">🚀 TaskFlow</h2>
          <button className="close-btn" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <nav className="sidebar-links">
          {user?.role === "admin" ? (
            <>
              <Link
                to="/admin"
                className={isActive("/admin") ? "active" : ""}
                onClick={closeMenu}
              >
                👑 Admin Dashboard
              </Link>
              <Link
                to="/admin/projects"
                className={isActive("/admin/projects") ? "active" : ""}
                onClick={closeMenu}
              >
                📁 Manage Projects
              </Link>
              <Link
                to="/admin/tasks"
                className={isActive("/admin/tasks") ? "active" : ""}
                onClick={closeMenu}
              >
                📝 Manage Tasks
              </Link>
              <Link
                to="/admin/users"
                className={isActive("/admin/users") ? "active" : ""}
                onClick={closeMenu}
              >
                👥 Manage Users
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
                onClick={closeMenu}
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/projects"
                className={isActive("/projects") ? "active" : ""}
                onClick={closeMenu}
              >
                📁 Projects
              </Link>
              <Link
                to="/tasks"
                className={isActive("/tasks") ? "active" : ""}
                onClick={closeMenu}
              >
                📝 Tasks
              </Link>
              <Link
                to="/kanban"
                className={isActive("/kanban") ? "active" : ""}
                onClick={closeMenu}
              >
                📋 Kanban Board
              </Link>
            </>
          )}
        </nav>

        {/* User Info Badge */}
        <div className="sidebar-user-card">
          <div className="user-avatar">{getUserInitials(user?.name)}</div>
          <div className="user-details">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role-badge">
              <span className="status-dot"></span>
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          🔓 Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;


