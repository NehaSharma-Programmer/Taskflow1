import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Target,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { MetricSkeleton } from "../components/SkeletonLoader";
import "../styles/dashboard.css";
import { getDashboardData } from "../services/dashboardService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getDashboardData();
      const projectList = Array.isArray(data.projects) ? data.projects : [];
      const taskList = Array.isArray(data.tasks) ? data.tasks : [];

      setProjects(projectList);
      setTasks(taskList);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError("Failed to load live metrics. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Compute Task Metrics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "Pending" || t.status === "Todo" || t.status === "In Progress"
  ).length;
  const completedTasks = tasks.filter(
    (t) => t.status === "Completed" || t.status === "Done"
  ).length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart Data Preparation
  const statusData = [
    { name: "Todo", count: tasks.filter((t) => t.status === "Todo").length },
    { name: "In Progress", count: inProgressTasks },
    { name: "Completed", count: completedTasks },
  ];

  const priorityData = [
    { name: "High 🔥", count: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium ⚡", count: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low 🌿", count: tasks.filter((t) => t.priority === "Low").length },
  ];

  const pieData = [
    { name: "Pending", value: pendingTasks, color: "#f59e0b" },
    { name: "Completed", value: completedTasks, color: "#10b981" },
  ];

  // Recent Activity Feed
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-text">
            <div className="welcome-badge">
              <Sparkles size={14} /> Workspace Analytics
            </div>
            <h1>Welcome back, {user?.name || "Member"} 👋</h1>
            <p>Here is your real-time project progress and productivity overview.</p>
          </div>
          <div className="header-actions">
            <Link to="/tasks" className="action-btn primary">
              <Plus size={16} /> New Task
            </Link>
            <Link to="/projects" className="action-btn secondary">
              <FolderKanban size={16} /> Projects
            </Link>
          </div>
        </header>

        {error && (
          <div className="dashboard-alert">
            <span>⚠️ {error}</span>
            <button onClick={loadDashboard} className="alert-retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Metric Summary Cards */}
        {isLoading ? (
          <MetricSkeleton />
        ) : (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon blue">
                <FolderKanban size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Projects</span>
                <span className="metric-value">{projects.length}</span>
              </div>
              <div className="metric-trend positive">
                <TrendingUp size={14} /> Active Spaces
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon purple">
                <Activity size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Tasks</span>
                <span className="metric-value">{totalTasks}</span>
              </div>
              <div className="metric-trend neutral">
                <Target size={14} /> Assigned Tasks
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon amber">
                <Clock size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Pending Tasks</span>
                <span className="metric-value">{pendingTasks}</span>
              </div>
              <div className="metric-badge warning">{inProgressTasks} In Progress</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon green">
                <CheckCircle2 size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Completed Tasks</span>
                <span className="metric-value">{completedTasks}</span>
              </div>
              <div className="metric-badge success">{completionPercentage}% Finished</div>
            </div>
          </div>
        )}

        {/* Productivity Completion Banner */}
        <div className="productivity-banner">
          <div className="banner-left">
            <h3>Overall Productivity Score</h3>
            <p>
              {completedTasks} of {totalTasks} tasks finished across all projects
            </p>
          </div>
          <div className="banner-right">
            <span className="progress-score">{completionPercentage}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="charts-grid">
          {/* Status Breakdown Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Task Status Distribution</h3>
              <span>Real-time</span>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={statusData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      borderRadius: "10px",
                      color: "var(--text-main)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Priority Breakdown</h3>
              <span>Urgency</span>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      borderRadius: "10px",
                      color: "var(--text-main)",
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline Section */}
        <div className="activity-section">
          <div className="activity-header">
            <h3>Recent Activity Feed</h3>
            <Link to="/tasks" className="view-all-link">
              View All Tasks <ArrowRight size={14} />
            </Link>
          </div>

          <div className="activity-list">
            {recentTasks.map((task) => (
              <div key={task._id} className="activity-item">
                <div className={`activity-dot ${task.status?.toLowerCase().replace(/\s+/g, "")}`}></div>
                <div className="activity-details">
                  <span className="activity-title">{task.title}</span>
                  <span className="activity-meta">
                    Priority: <strong>{task.priority || "Medium"}</strong> | Project:{" "}
                    {task.project?.title || "General"}
                  </span>
                </div>
                <span className={`status-pill ${task.status?.toLowerCase().replace(/\s+/g, "")}`}>
                  {task.status || "Todo"}
                </span>
              </div>
            ))}

            {recentTasks.length === 0 && (
              <div className="empty-activity">
                <p>No recent activity recorded. Create your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
