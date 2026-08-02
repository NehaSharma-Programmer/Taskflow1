import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setAlertInfo({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setIsLoading(true);
    setAlertInfo({ type: "", message: "" });

    try {
      const res = await axios.post(
        "https://taskflowbackend-qhqg.onrender.com/api/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAlertInfo({ type: "success", message: "Login successful! Redirecting..." });

      setTimeout(() => {
        if (res.data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 600);
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: error.response?.data?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === "admin") {
      setEmail("admin@taskflow.com");
      setPassword("admin123");
    } else {
      setEmail("user@taskflow.com");
      setPassword("user123");
    }
    setAlertInfo({ type: "info", message: `Prefilled demo ${role} credentials.` });
  };

  return (
    <div className="login-container">
      {/* Background glow Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="login-wrapper">
        {/* Left Side Showcase */}
        <div className="login-showcase">
          <div className="brand-badge">
            <span className="brand-dot"></span> TaskFlow Enterprise v2.0
          </div>
          <h1>Streamline Your Workflow</h1>
          <p>
            The complete project and task management platform built for modern teams and high-performing organizations.
          </p>

          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Lightning Fast</strong>
                <p>Instant status updates & task tracking</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📋</span>
              <div>
                <strong>Interactive Kanban</strong>
                <p>Drag & drop project organization</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <strong>Smart Dashboard</strong>
                <p>Real-time completion metrics & insights</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <strong>Secure Access</strong>
                <p>Role-based admin & user permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="login-card">
          <div className="card-header">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          {alertInfo.message && (
            <div className={`status-alert ${alertInfo.type}`}>
              <span>
                {alertInfo.type === "error"
                  ? "❌ "
                  : alertInfo.type === "success"
                  ? "✅ "
                  : "💡 "}
                {alertInfo.message}
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-spinner-wrap">
                  <span className="spinner"></span> Signing In...
                </span>
              ) : (
                "Sign In to TaskFlow 🚀"
              )}
            </button>
          </form>

          {/* Quick Demo Fill Section */}
          <div className="demo-fill-section">
            <span className="demo-label">Testing Demo Accounts:</span>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleQuickFill("user")}
              >
                👤 User Demo
              </button>
              <button
                type="button"
                className="demo-btn admin"
                onClick={() => handleQuickFill("admin")}
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          <div className="register-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
