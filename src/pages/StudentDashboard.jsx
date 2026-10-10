import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const API_URL = "http://localhost:8080/api/student/profile";

function StudentDashboard() {

  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  useEffect(() => {

    const loggedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/${loggedUser.studentId}`)

      .then((response) => {

        if (!response.ok) {
          throw new Error("Student not found");
        }

        return response.json();
      })

      .then((data) => {
        setStudent(data);
      })

      .catch(() => {
        alert("Unable to load student details");
      });

  }, [navigate]);


  const logout = () => {

    localStorage.removeItem("user");

    navigate("/login");
  };


  if (!student) {
    return (
      <h2 className="loading">
        Loading...
      </h2>
    );
  }


  return (

    <div className="student-dashboard">

      <nav className="navbar">

        <h2>
          Student Management System
        </h2>

        <button onClick={logout}>
          Logout
        </button>

      </nav>


      <div className="dashboard-content">

        <h1>
          Welcome, {student.name} 👋
        </h1>


        <div className="student-card">

          <h2>
            My Profile
          </h2>


          <div className="detail">
            <strong>Student ID:</strong>
            <span>{student.studentId}</span>
          </div>


          <div className="detail">
            <strong>Name:</strong>
            <span>{student.name}</span>
          </div>


          <div className="detail">
            <strong>Branch:</strong>
            <span>{student.branch}</span>
          </div>


          <div className="detail">
            <strong>Marks:</strong>
            <span>{student.marks}</span>
          </div>


          <div className="detail">
            <strong>Grade:</strong>
            <span>{student.grade}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;