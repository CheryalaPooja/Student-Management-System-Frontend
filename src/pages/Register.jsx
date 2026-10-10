import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const API_URL = "http://localhost:8080/api/auth/register";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    // Check empty fields
    if (!name || !studentId || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: name,
          studentId: studentId,
          email: email,
          password: password,
          role: "STUDENT"
        })
      });

      if (!response.ok) {

        const message = await response.text();

        alert(
          message || "Registration failed"
        );

        return;
      }

      alert("Registration successful!");

      // Go to Login page
      navigate("/login");

    } catch (error) {

      console.error(error);

      alert("Cannot connect to backend");

    }
  };

  return (

    <div className="register-page">

      <div className="register-box">

        <h1>Student Management System</h1>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

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
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;