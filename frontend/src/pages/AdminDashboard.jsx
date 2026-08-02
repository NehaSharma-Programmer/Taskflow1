import { useEffect, useState } from "react";
import axios from "axios";
import { Users, FolderKanban, CheckCircle2, Clock, ShieldCheck, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import { MetricSkeleton } from "../components/SkeletonLoader";
import "../styles/dashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://taskflowbackend-qhqg.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(res.data);
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const chartData = [
    { name: "Users", count: stats.totalUsers },
    { name: "Projects", count: stats.totalProjects },
    { name: "Total Tasks", count: stats.totalTasks },
    { name: "Pending", count: stats.pendingTasks },
    { name: "Completed", count: stats.completedTasks },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-text">
            <div className="welcome-badge">
              <ShieldCheck size={14} /> System Administrator
            </div>
            <h1>Admin Overview 👑</h1>
            <p>Monitor platform usage, registered users, and system task performance.</p>
          </div>
        </header>

        {isLoading ? (
          <MetricSkeleton />
        ) : (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon purple">
                <Users size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Registered Users</span>
                <span className="metric-value">{stats.totalUsers}</span>
              </div>
              <div className="metric-trend positive">System Members</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon blue">
                <FolderKanban size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Projects</span>
                <span className="metric-value">{stats.totalProjects}</span>
              </div>
              <div className="metric-trend neutral">Global Workspaces</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon amber">
                <Clock size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Pending Tasks</span>
                <span className="metric-value">{stats.pendingTasks}</span>
              </div>
              <div className="metric-badge warning">In Backlog</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon green">
                <CheckCircle2 size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Completed Tasks</span>
                <span className="metric-value">{stats.completedTasks}</span>
              </div>
              <div className="metric-badge success">Finished</div>
            </div>
          </div>
        )}

        <div className="charts-grid" style={{ marginTop: "24px" }}>
          <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
            <div className="chart-header">
              <h3>System Distribution Metrics</h3>
              <span>Overview</span>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
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
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
