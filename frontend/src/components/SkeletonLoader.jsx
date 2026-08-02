export function CardSkeleton({ count = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", width: "100%" }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "18px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="skeleton-box" style={{ width: "40%", height: "20px" }}></div>
            <div className="skeleton-box" style={{ width: "24px", height: "24px", borderRadius: "50%" }}></div>
          </div>
          <div className="skeleton-box" style={{ width: "80%", height: "14px" }}></div>
          <div className="skeleton-box" style={{ width: "60%", height: "14px" }}></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <div className="skeleton-box" style={{ width: "30%", height: "24px", borderRadius: "12px" }}></div>
            <div className="skeleton-box" style={{ width: "25%", height: "24px", borderRadius: "12px" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", width: "100%" }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "14px", flexShrink: 0 }}></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="skeleton-box" style={{ width: "60px", height: "28px" }}></div>
            <div className="skeleton-box" style={{ width: "90px", height: "14px" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
