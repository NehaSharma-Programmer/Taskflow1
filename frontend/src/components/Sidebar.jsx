
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";


function Sidebar() {


  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));



  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };



  return (

    <div className="sidebar">



      <h2 className="logo">
        🚀 TaskFlow
      </h2>




      {
        user?.role === "admin" ? (

          <>


            <Link to="/admin">

              👑 Admin Dashboard

            </Link>



            <Link to="/admin/projects">

              📁 Manage Projects

            </Link>



            <Link to="/admin/tasks">

              📝 Manage Tasks

            </Link>



            <Link to="/admin/users">

              👥 Manage Users

            </Link>



          </>


        ) : (


          <>


            <Link to="/dashboard">

              🏠 Dashboard

            </Link>



            <Link to="/projects">

              📁 Projects

            </Link>



            <Link to="/tasks">

              📝 Tasks

            </Link>



            <Link to="/kanban">

              📋 Kanban Board

            </Link>



          </>


        )

      }





      <button onClick={logout}>

        🔓 Logout

      </button>




    </div>

  );

}


export default Sidebar;