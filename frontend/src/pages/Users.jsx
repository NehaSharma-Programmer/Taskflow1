
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Users(){

  const [users, setUsers] = useState([]);


  const getUsers = async()=>{

    try{

      const token = localStorage.getItem("token");


      const res = await axios.get(
        "https://taskflowbackend-qhqg.onrender.com/api/admin/users",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      setUsers(res.data);


    }catch(error){

      console.log("Users Error:", error);

    }

  };


  useEffect(()=>{

    getUsers();

  },[]);



  return (

    <div className="dashboard">


      <Sidebar />


      <div className="main-content">


        <div className="header">

          <h1>
            👥 Manage Users
          </h1>


          <p>
            Admin can view all users here.
          </p>

        </div>



        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



      </div>


    </div>

  );

}


export default Users;
