import { AlertTriangle } from "lucide-react";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-danger)", marginBottom: "8px" }}>
            <AlertTriangle size={24} />
            <h3 style={{ margin: 0 }}>{title || "Confirm Action"}</h3>
          </div>
          <p>{message || "Are you sure you want to proceed? This action cannot be undone."}</p>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
