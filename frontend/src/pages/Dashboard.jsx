import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { getDashboardData } from "../services/dashboardService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getDashboardData();

      const projects = Array.isArray(data.projects) ? data.projects : [];
      const tasks = Array.isArray(data.tasks) ? data.tasks : [];

      setProjectCount(projects.length);
      setTaskCount(tasks.length);

      const pending = tasks.filter(
        (task) =>
          task.status === "Pending" ||
          task.status === "Todo" ||
          task.status === "In Progress"
      ).length;

      const completed = tasks.filter(
        (task) => task.status === "Completed" || task.status === "Done"
      ).length;

      setPendingCount(pending);
      setCompletedCount(completed);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError("Failed to load dashboard metrics. Retrying...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const completionPercentage =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <div className="header-info">
            <h1>👋 Welcome back, {user?.name || "User"}!</h1>
            <p>Manage your projects, track tasks, and stay productive.</p>
          </div>
          <div className="header-actions">
            <Link to="/tasks" className="quick-action-btn primary">
              ➕ Add Task
            </Link>
            <Link to="/projects" className="quick-action-btn secondary">
              📁 Projects
            </Link>
            <Link to="/kanban" className="quick-action-btn outline">
              📋 Kanban
            </Link>
          </div>
        </div>

        {error && (
          <div className="dashboard-alert error">
            <span>⚠️ {error}</span>
            <button onClick={loadDashboard} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        )}

        {/* Overall Progress Banner */}
        <div className="progress-banner">
          <div className="progress-banner-header">
            <div>
              <h3>Overall Tasks Completion</h3>
              <p>
                {isLoading
                  ? "Loading task stats..."
                  : `${completedCount} of ${taskCount} tasks finished`}
              </p>
            </div>
            <span className="progress-percent">
              {isLoading ? "..." : `${completionPercentage}%`}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${isLoading ? 0 : completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="cards">
          <Link to="/projects" className="card">
            <div className="card-icon">📁</div>
            <div>
              <h2>{isLoading ? "..." : projectCount}</h2>
              <p>Total Projects</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon">📝</div>
            <div>
              <h2>{isLoading ? "..." : taskCount}</h2>
              <p>Total Tasks</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon pending">⏳</div>
            <div>
              <h2>{isLoading ? "..." : pendingCount}</h2>
              <p>Pending Tasks</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon completed">✅</div>
            <div>
              <h2>{isLoading ? "..." : completedCount}</h2>
              <p>Completed Tasks</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
