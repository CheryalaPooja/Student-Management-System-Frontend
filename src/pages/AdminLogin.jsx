import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_URL = "http://localhost:8080/api/auth/login";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        alert("Invalid admin email or password");
        return;
      }

      const user = await response.json();

      if (user.role !== "ADMIN") {
        alert("This account is not an admin account");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      alert("Admin login successful!");

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      alert("Cannot connect to backend");
    }
  };

  return (

    <div className="admin-login-page">

      <div className="admin-login-box">

        <h1>Student Management System</h1>

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Admin Login
          </button>

        </form>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;