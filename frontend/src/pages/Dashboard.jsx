// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import "../styles/dashboard.css";
// import { getDashboardData } from "../services/dashboardService";

// function Dashboard() {

//     const user = JSON.parse(localStorage.getItem("user"));

//   const [projectCount, setProjectCount] = useState(0);
//   const [taskCount, setTaskCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);
//   const [completedCount, setCompletedCount] = useState(0);

//   const loadDashboard = async () => {

//     try {

//       const data = await getDashboardData();

//       setProjectCount(data.projects.length);

//       setTaskCount(data.tasks.length);

//       const pending = data.tasks.filter(
//         (task) => task.status === "Pending"
//       ).length;

//       const completed = data.tasks.filter(
//         (task) => task.status === "Completed"
//       ).length;

//       setPendingCount(pending);

//       setCompletedCount(completed);

//     } catch (error) {

//       console.log(error);

//     }

//   };

//   useEffect(() => {

//     loadDashboard();

//   }, []);

//   return (

//     <div className="dashboard">

//       <Sidebar />

//       <div className="main-content">

//         <div className="header">

//          <h1>👋 Welcome, {user?.name}</h1>

//           <p>Manage all your Projects & Tasks from one place.</p>

//         </div>

//         <div className="cards">

//           <div className="card">

//             <h2>📁 Total Projects</h2>

//             <p>{projectCount}</p>

//           </div>

//           <div className="card">

//             <h2>✅ Total Tasks</h2>

//             <p>{taskCount}</p>

//           </div>

//           <div className="card">

//             <h2>⏳ Pending Tasks</h2>

//             <p>{pendingCount}</p>

//           </div>

//           <div className="card">

//             <h2>✔ Completed Tasks</h2>

//             <p>{completedCount}</p>

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// }

// export default Dashboard;
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

  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();

      setProjectCount(data.projects ? data.projects.length : 0);
      setTaskCount(data.tasks ? data.tasks.length : 0);

      const pending = (data.tasks || []).filter(
        (task) => task.status === "Pending" || task.status === "Todo" || task.status === "In Progress"
      ).length;

      const completed = (data.tasks || []).filter(
        (task) => task.status === "Completed" || task.status === "Done"
      ).length;

      setPendingCount(pending);
      setCompletedCount(completed);
    } catch (error) {
      console.log(error);
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

        {/* Overall Progress Banner */}
        <div className="progress-banner">
          <div className="progress-banner-header">
            <div>
              <h3>Overall Tasks Completion</h3>
              <p>{completedCount} of {taskCount} tasks finished</p>
            </div>
            <span className="progress-percent">{completionPercentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="cards">
          <Link to="/projects" className="card">
            <div className="card-icon">📁</div>
            <div>
              <h2>{projectCount}</h2>
              <p>Total Projects</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon">📝</div>
            <div>
              <h2>{taskCount}</h2>
              <p>Total Tasks</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon pending">⏳</div>
            <div>
              <h2>{pendingCount}</h2>
              <p>Pending Tasks</p>
            </div>
          </Link>

          <Link to="/tasks" className="card">
            <div className="card-icon completed">✅</div>
            <div>
              <h2>{completedCount}</h2>
              <p>Completed Tasks</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

