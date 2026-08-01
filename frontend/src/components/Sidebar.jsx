
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
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
              <Link to="/admin" onClick={closeMenu}>
                👑 Admin Dashboard
              </Link>
              <Link to="/admin/projects" onClick={closeMenu}>
                📁 Manage Projects
              </Link>
              <Link to="/admin/tasks" onClick={closeMenu}>
                📝 Manage Tasks
              </Link>
              <Link to="/admin/users" onClick={closeMenu}>
                👥 Manage Users
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                🏠 Dashboard
              </Link>
              <Link to="/projects" onClick={closeMenu}>
                📁 Projects
              </Link>
              <Link to="/tasks" onClick={closeMenu}>
                📝 Tasks
              </Link>
              <Link to="/kanban" onClick={closeMenu}>
                📋 Kanban Board
              </Link>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={logout}>
          🔓 Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;

