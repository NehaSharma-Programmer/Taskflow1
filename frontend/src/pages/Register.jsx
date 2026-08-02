import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    if (!name || !email || !password) {
      setAlertInfo({ type: "error", message: "Please fill in all fields." });
      return;
    }

    if (password.length < 6) {
      setAlertInfo({
        type: "error",
        message: "Password should be at least 6 characters long.",
      });
      return;
    }

    setIsLoading(true);
    setAlertInfo({ type: "", message: "" });

    try {
      await axios.post(
        "https://taskflowbackend-qhqg.onrender.com/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      setAlertInfo({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setAlertInfo({
        type: "error",
        message:
          error.response?.data?.message ||
          "Registration failed. Email may already be registered.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Background glow Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="register-wrapper">
        {/* Left Side Showcase */}
        <div className="register-showcase">
          <div className="brand-badge">
            <span className="brand-dot"></span> Join TaskFlow Workspace
          </div>
          <h1>Empower Your Productivity</h1>
          <p>
            Create your account today and unlock a clean, collaborative environment for tracking tasks and executing projects.
          </p>

          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <strong>Goal Tracking</strong>
                <p>Stay focused on high-priority deliverables</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📁</span>
              <div>
                <strong>Organized Projects</strong>
                <p>Categorize tasks into custom project spaces</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <strong>Modern Interface</strong>
                <p>Intuitive Kanban boards & status tracking</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <strong>Data Privacy</strong>
                <p>Secure encrypted token authorization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Register Card */}
        <div className="register-card">
          <div className="card-header">
            <h2>Create Account ✨</h2>
            <p>Get started with TaskFlow in seconds</p>
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

          <form onSubmit={handleRegister} className="register-form">
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
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
              className={`register-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-spinner-wrap">
                  <span className="spinner"></span> Creating Account...
                </span>
              ) : (
                "Create Account 🚀"
              )}
            </button>
          </form>

          <div className="login-footer">
            Already have an account? <Link to="/">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
