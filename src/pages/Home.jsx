import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const openAdminDashboard = () => {

    // Admin user information
    const adminUser = {
      name: "Admin",
      email: "admin@gmail.com",
      role: "ADMIN"
    };

    // Save admin information
    localStorage.setItem(
      "user",
      JSON.stringify(adminUser)
    );

    // Open dashboard directly
    navigate("/dashboard");
  };

  return (

    <div className="home-page">

      {/* Navigation Bar */}

      <nav className="home-navbar">

        <h2>
          Student Management System
        </h2>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰ Menu
        </button>

      </nav>


      {/* Menu */}

      {menuOpen && (

        <div className="menu-box">

          {/* Student Register */}

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/register");
            }}
          >
            👨‍🎓 Student Register
          </button>


          {/* Student Login */}

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            🔐 Student Login
          </button>


          {/* Admin Direct Access */}

          <button
            onClick={() => {
              setMenuOpen(false);
              openAdminDashboard();
            }}
          >
            👨‍💼 Admin
          </button>

        </div>

      )}


      {/* Home Content */}

      <div className="home-content">

        <h1>
          Welcome to Student Management System
        </h1>

        <p>
          Manage student information easily and efficiently.
        </p>

        <button
          className="get-started"
          onClick={() => setMenuOpen(true)}
        >
          Get Started
        </button>

      </div>

    </div>
  );
}

export default Home;