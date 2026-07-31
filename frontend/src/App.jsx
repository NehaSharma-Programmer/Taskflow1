
import { Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

import AdminDashboard from "./pages/AdminDashboard";

import Kanban from "./pages/Kanban";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {


  return (


    <Routes>



      {/* Login */}

      <Route

        path="/"

        element={<Login />}

      />




      {/* Register */}

      <Route

        path="/register"

        element={<Register />}

      />






      {/* User Dashboard */}

      <Route

        path="/dashboard"

        element={

          <ProtectedRoute>

            <Dashboard />

          </ProtectedRoute>

        }

      />






      {/* Admin Dashboard */}

      <Route

        path="/admin"

        element={

          <ProtectedRoute>

            <AdminDashboard />

          </ProtectedRoute>

        }

      />







      {/* User + Admin Projects */}

      <Route

        path="/projects"

        element={

          <ProtectedRoute>

            <Projects />

          </ProtectedRoute>

        }

      />




      {/* User + Admin Tasks */}

      <Route

        path="/tasks"

        element={

          <ProtectedRoute>

            <Tasks />

          </ProtectedRoute>

        }

      />







      {/* User Kanban */}

      <Route

        path="/kanban"

        element={

          <ProtectedRoute>

            <Kanban />

          </ProtectedRoute>

        }

      />








      {/* ======================
          ADMIN MANAGEMENT ROUTES
          ====================== */}




      {/* Admin Users */}

      <Route

        path="/admin/users"

        element={

          <ProtectedRoute>

            <Users />

          </ProtectedRoute>

        }

      />





      {/* Admin Projects */}

      <Route

        path="/admin/projects"

        element={

          <ProtectedRoute>

            <Projects />

          </ProtectedRoute>

        }

      />





      {/* Admin Tasks */}

      <Route

        path="/admin/tasks"

        element={

          <ProtectedRoute>

            <Tasks />

          </ProtectedRoute>

        }

      />




    </Routes>


  );

}



export default App;