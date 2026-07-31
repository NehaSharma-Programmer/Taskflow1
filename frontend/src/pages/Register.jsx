import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await axios.post("https://taskflow1-1jps.onrender.com/api/auth/register", {

        name,
        email,
        password

      });

      alert("Registration Successful ✅");

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || "Registration Failed");

    }

  };

  return (

    <div className="register-container">

      <div className="register-card">

        <h1>🚀 TaskFlow</h1>

        <p>Create Your Account</p>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="register-btn"
          onClick={handleRegister}
        >
          Register
        </button>

        <div className="login-text">

          Already have an account?

          <Link to="/"> Login</Link>

        </div>

      </div>

    </div>

  );

}

export default Register;