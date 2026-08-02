import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Users,
  LogOut,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
      {/* Mobile Top Header Bar */}
      <div className="mobile-header">
        <div className="mobile-logo-wrap">
          <div className="logo-icon-badge">
            <Sparkles size={18} color="#ffffff" />
          </div>
          <span className="mobile-logo-text">TaskFlow</span>
        </div>
        <div className="mobile-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div className="sidebar-overlay open" onClick={closeMenu}></div>
      )}

      {/* Sidebar Navigation Drawer */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo-brand">
            <div className="logo-icon-badge">
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">TaskFlow</span>
              <span className="logo-tag">PRO SAAS</span>
            </div>
          </div>
          <button className="close-btn" onClick={closeMenu} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-links">
          {user?.role === "admin" ? (
            <>
              <div className="nav-section-title">ADMIN MANAGEMENT</div>
              <Link
                to="/admin"
                className={`nav-item ${isActive("/admin") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <Shield size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/projects"
                className={`nav-item ${isActive("/admin/projects") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <FolderKanban size={18} />
                <span>Manage Projects</span>
              </Link>
              <Link
                to="/admin/tasks"
                className={`nav-item ${isActive("/admin/tasks") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <CheckSquare size={18} />
                <span>Manage Tasks</span>
              </Link>
              <Link
                to="/admin/users"
                className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Link>
            </>
          ) : (
            <>
              <div className="nav-section-title">WORKSPACE</div>
              <Link
                to="/dashboard"
                className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/projects"
                className={`nav-item ${isActive("/projects") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <FolderKanban size={18} />
                <span>Projects</span>
              </Link>
              <Link
                to="/tasks"
                className={`nav-item ${isActive("/tasks") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <CheckSquare size={18} />
                <span>Task List</span>
              </Link>
              <Link
                to="/kanban"
                className={`nav-item ${isActive("/kanban") ? "active" : ""}`}
                onClick={closeMenu}
              >
                <Columns3 size={18} />
                <span>Kanban Board</span>
              </Link>
            </>
          )}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          <div className="theme-toggle-bar">
            <span>Theme Mode</span>
            <button
              className="theme-switch"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={15} /> Dark Mode
                </>
              ) : (
                <>
                  <Moon size={15} /> Light Mode
                </>
              )}
            </button>
          </div>

          <div className="sidebar-user-card">
            <div className="user-avatar">{getUserInitials(user?.name)}</div>
            <div className="user-details">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-role-badge">
                <span className="status-dot"></span>
                {user?.role === "admin" ? "Admin" : "Pro Member"}
              </span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
