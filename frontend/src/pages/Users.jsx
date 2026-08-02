import { useEffect, useState } from "react";
import axios from "axios";
import { Users as UsersIcon, Search, Shield, User, Mail } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { CardSkeleton } from "../components/SkeletonLoader";
import { useToast } from "../context/ToastContext";
import "../styles/dashboard.css";

function Users() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://taskflowbackend-qhqg.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Users Error:", error);
      showToast("Failed to load user list", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-text">
            <div className="welcome-badge">
              <Shield size={14} /> Admin Controls
            </div>
            <h1>👥 User Directory</h1>
            <p>View registered account members and administrator roles across TaskFlow.</p>
          </div>

          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {isLoading ? (
          <CardSkeleton count={4} />
        ) : (
          <div className="metrics-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filteredUsers.map((u) => (
              <div key={u._id} className="metric-card" style={{ gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: u.role === "admin" ? "var(--accent-gradient)" : "rgba(16, 185, 129, 0.15)",
                      color: u.role === "admin" ? "white" : "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    {u.name ? u.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "var(--text-main)" }}>
                      {u.name}
                    </h3>
                    <span className={`status-pill ${u.role === "admin" ? "inprogress" : "done"}`} style={{ marginTop: "4px", display: "inline-block" }}>
                      {u.role === "admin" ? "👑 Admin" : "👤 Member"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                  <Mail size={14} /> {u.email}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="empty-activity" style={{ gridColumn: "1 / -1" }}>
                <p>No matching users found in directory.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Users;
