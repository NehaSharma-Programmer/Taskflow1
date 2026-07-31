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


      setProjectCount(data.projects.length);

      setTaskCount(data.tasks.length);


      const pending = data.tasks.filter(
        (task) => task.status === "Pending"
      ).length;


      const completed = data.tasks.filter(
        (task) => task.status === "Completed"
      ).length;


      setPendingCount(pending);

      setCompletedCount(completed);


    } catch(error){

      console.log(error);

    }

  };


  useEffect(()=>{

    loadDashboard();

  },[]);



  return (

    <div className="dashboard">


      <Sidebar />


      <div className="main-content">


        <div className="header">

          <h1>
            👋 Welcome, {user?.name}
          </h1>


          <p>
            Manage all your projects and tasks from one powerful workspace.
          </p>


        </div>



        <div className="cards">


          <div className="card">

            <div className="card-icon">
              📁
            </div>

            <div>

              <h2>
                {projectCount}
              </h2>

              <p>
                Total Projects
              </p>

            </div>

          </div>



          <div className="card">

            <div className="card-icon">
              📝
            </div>

            <div>

              <h2>
                {taskCount}
              </h2>

              <p>
                Total Tasks
              </p>

            </div>

          </div>



          <div className="card">

            <div className="card-icon pending">
              ⏳
            </div>

            <div>

              <h2>
                {pendingCount}
              </h2>

              <p>
                Pending Tasks
              </p>

            </div>

          </div>



          <div className="card">

            <div className="card-icon completed">
              ✅
            </div>

            <div>

              <h2>
                {completedCount}
              </h2>

              <p>
                Completed Tasks
              </p>

            </div>

          </div>



        </div>


      </div>


    </div>

  );

}


export default Dashboard;