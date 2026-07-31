import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function AdminDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });


  const loadDashboard = async () => {

    try {

      const token = localStorage.getItem("token");


      const res = await axios.get(
        "https://taskflow1-1jps.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setStats(res.data);


    } catch (error) {

      console.log(error);
      alert("Failed to load Admin Dashboard");

    }

  };


  useEffect(() => {
    loadDashboard();
  }, []);



  return (

    <div className="dashboard">


      <Sidebar />


      <div className="main-content">


        <div className="header">

          <h1>👑 Admin Dashboard</h1>

          <p>
            Welcome, {user?.name}
          </p>

        </div>



        <div className="cards">


          <div className="card">

            <h2>👥 Total Users</h2>

            <p>
              {stats.totalUsers}
            </p>

          </div>



          <div className="card">

            <h2>📁 Total Projects</h2>

            <p>
              {stats.totalProjects}
            </p>

          </div>




          <div className="card">

            <h2>✅ Total Tasks</h2>

            <p>
              {stats.totalTasks}
            </p>

          </div>




          <div className="card">

            <h2>⏳ Pending Tasks</h2>

            <p>
              {stats.pendingTasks}
            </p>

          </div>




          <div className="card">

            <h2>✔ Completed Tasks</h2>

            <p>
              {stats.completedTasks}
            </p>

          </div>



        </div>


      </div>


    </div>

  );

}


export default AdminDashboard;
