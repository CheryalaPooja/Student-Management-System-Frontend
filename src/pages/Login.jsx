import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:8080/api/auth/login";

function Login() {

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

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        console.error(
          "Login error:",
          errorText
        );

        alert("Invalid email or password");

        return;
      }

      const user = await response.json();

      console.log("Login response:", user);

      // Store login information
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      alert("Login successful!");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Connection error:",
        error
      );

      alert(
        "Cannot connect to backend. Please make sure Spring Boot is running."
      );

    }
  };


  return (

    <div className="login-page">

      <div className="login-box">

        <h1>
          Student Management System
        </h1>

        <h2>
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
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
            Login
          </button>

        </form>

        <p>

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;