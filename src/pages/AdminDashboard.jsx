import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:8080/api/admin/students";

function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [marks, setMarks] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser || loggedUser.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadStudents();
  }, [navigate]);

  const loadStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      alert("Cannot load students");
    }
  };

  const addStudent = async () => {
    if (!studentId || !name || !branch || marks === "") {
      alert("Please fill all fields");
      return;
    }

    if (marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId,
          name,
          branch,
          marks: Number(marks)
        })
      });

      if (!response.ok) {
        alert("Failed to add student");
        return;
      }

      alert("Student added successfully");

      setStudentId("");
      setName("");
      setBranch("");
      setMarks("");

      loadStudents();

    } catch (error) {
      alert("Cannot connect to backend");
    }
  };

  const editStudent = async (student) => {
    const newName = prompt(
      "Enter Student Name:",
      student.name
    );

    if (newName === null) {
      return;
    }

    const newMarks = prompt(
      "Enter Marks:",
      student.marks
    );

    if (newMarks === null) {
      return;
    }

    if (newMarks < 0 || newMarks > 100) {
      alert("Marks must be between 0 and 100");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: student.studentId,
            name: newName,
            branch: student.branch,
            marks: Number(newMarks)
          })
        }
      );

      if (!response.ok) {
        alert("Failed to update student");
        return;
      }

      alert("Student updated successfully");

      loadStudents();

    } catch (error) {
      alert("Cannot connect to backend");
    }
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        alert("Failed to delete student");
        return;
      }

      alert("Student deleted successfully");

      loadStudents();

    } catch (error) {
      alert("Cannot connect to backend");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredStudents = students.filter((student) =>
    student.studentId
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    student.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">

      <nav className="admin-navbar">

        <h2>
          Student Management System
        </h2>

        <div>
          <span>Admin</span>

          <button onClick={logout}>
            Logout
          </button>
        </div>

      </nav>


      <div className="admin-content">

        <h1>
          Admin Dashboard
        </h1>


        {/* Add Student */}

        <div className="admin-form">

          <h2>
            Add Student
          </h2>

          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Marks"
            value={marks}
            onChange={(e) =>
              setMarks(e.target.value)
            }
          />

          <button
            className="add-button"
            onClick={addStudent}
          >
            Add Student
          </button>

        </div>


        {/* Search */}

        <div className="admin-search">

          <input
            type="text"
            placeholder="Search by ID or Name"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* Students Table */}

        <div className="admin-table">

          <h2>
            All Students
          </h2>

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredStudents.map((student) => (

                <tr key={student.id}>

                  <td>
                    {student.studentId}
                  </td>

                  <td>
                    {student.name}
                  </td>

                  <td>
                    {student.branch}
                  </td>

                  <td>
                    {student.marks}
                  </td>

                  <td>
                    {student.grade}
                  </td>

                  <td>

                    <button
                      className="edit-button"
                      onClick={() =>
                        editStudent(student)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteStudent(student.id)
                      }
                    >
                      Delete
                    </button>

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

export default AdminDashboard;