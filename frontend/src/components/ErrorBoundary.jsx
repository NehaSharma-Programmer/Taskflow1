import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TaskFlow App Error Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            color: "var(--text-main)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <AlertOctagon size={50} color="var(--accent-danger)" style={{ marginBottom: "16px" }} />
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Something went wrong</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px", lineHeight: 1.5 }}>
              An unhandled UI error occurred. Don't worry, your data is safe. Try refreshing the application.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "var(--accent-gradient)",
                color: "white",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} /> Reload TaskFlow
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
