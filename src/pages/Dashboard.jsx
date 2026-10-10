import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const STUDENT_API =
  "http://localhost:8080/api/student/profile";

const ADMIN_API =
  "http://localhost:8080/api/admin/students";

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [marks, setMarks] = useState("");
  const [search, setSearch] = useState("");

  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    setUser(loggedUser);

    // ADMIN
    if (loggedUser.role === "ADMIN") {

      loadStudents();

    }

    // STUDENT
    else {

      const id = loggedUser.studentId;

      console.log("Logged student ID:", id);

      if (!id) {
        console.error("Student ID is missing");
        return;
      }

      fetch(`${STUDENT_API}/${id}`)

        .then((response) => {

          if (!response.ok) {
            throw new Error("Student not found");
          }

          return response.json();

        })

        .then((data) => {

          console.log("Student details:", data);

          setStudent(data);

        })

        .catch((error) => {

          console.error(
            "Student fetch error:",
            error
          );

        });

    }

  }, [navigate]);


  // ==========================================
  // LOAD ALL STUDENTS - ADMIN
  // ==========================================

  const loadStudents = async () => {

    try {

      const response = await fetch(ADMIN_API);

      if (!response.ok) {
        throw new Error(
          "Failed to load students"
        );
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      console.error(error);

      alert(
        "Cannot load students"
      );

    }

  };


  // ==========================================
  // ADD STUDENT
  // ==========================================

  const addStudent = async () => {

    if (
      !studentId ||
      !name ||
      !branch ||
      marks === ""
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    if (
      Number(marks) < 0 ||
      Number(marks) > 100
    ) {

      alert(
        "Marks must be between 0 and 100"
      );

      return;
    }

    try {

      const response = await fetch(
        ADMIN_API,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            studentId: studentId,

            name: name,

            branch: branch,

            marks: Number(marks)

          })

        }
      );

      if (!response.ok) {

        alert(
          "Failed to add student"
        );

        return;
      }

      alert(
        "Student added successfully"
      );

      setStudentId("");
      setName("");
      setBranch("");
      setMarks("");

      loadStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Cannot connect to backend"
      );

    }

  };


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const deleteStudent = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${ADMIN_API}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        alert(
          "Failed to delete student"
        );

        return;
      }

      alert(
        "Student deleted successfully"
      );

      loadStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Cannot connect to backend"
      );

    }

  };


  // ==========================================
  // EDIT STUDENT
  // ==========================================

  const editStudent = async (studentData) => {

    const newName = prompt(
      "Enter Student Name:",
      studentData.name
    );

    if (newName === null) {
      return;
    }

    const newMarks = prompt(
      "Enter Marks:",
      studentData.marks
    );

    if (newMarks === null) {
      return;
    }

    if (
      Number(newMarks) < 0 ||
      Number(newMarks) > 100
    ) {

      alert(
        "Marks must be between 0 and 100"
      );

      return;
    }

    try {

      const response = await fetch(
        `${ADMIN_API}/${studentData.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            studentId:
              studentData.studentId,

            name:
              newName,

            branch:
              studentData.branch,

            marks:
              Number(newMarks)

          })

        }
      );

      if (!response.ok) {

        alert(
          "Failed to update student"
        );

        return;
      }

      alert(
        "Student updated successfully"
      );

      loadStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Cannot connect to backend"
      );

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem("user");

    navigate("/");

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents =
    students.filter((item) => {

      const studentIdText =
        String(
          item.studentId || ""
        ).toLowerCase();

      const nameText =
        String(
          item.name || ""
        ).toLowerCase();

      const searchText =
        search.toLowerCase();

      return (
        studentIdText.includes(
          searchText
        ) ||
        nameText.includes(
          searchText
        )
      );

    });


  // ==========================================
  // LOADING
  // ==========================================

  if (!user) {

    return (
      <div className="loading">
        Loading...
      </div>
    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="dashboard">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="dashboard-navbar">

        <h2>
          Student Management System
        </h2>

        <div className="dashboard-menu">

          <button
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

          <span className="user-name">

            {user.role === "ADMIN"
              ? "Admin"
              : student?.name || user.name}

          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="dashboard-content">


        {/* ====================================
            STUDENT
        ==================================== */}

        {user.role === "STUDENT" && (

          <>

            <h1>
              Welcome,{" "}
              {student?.name || user.name}
            </h1>


            {student ? (

              <div className="student-card">

                <h2>
                  My Profile
                </h2>


                <div className="detail">

                  <strong>
                    Student ID:
                  </strong>

                  <span>
                    {student.studentId}
                  </span>

                </div>


                <div className="detail">

                  <strong>
                    Name:
                  </strong>

                  <span>
                    {student.name}
                  </span>

                </div>


                <div className="detail">

                  <strong>
                    Branch:
                  </strong>

                  <span>
                    {student.branch}
                  </span>

                </div>


                <div className="detail">

                  <strong>
                    Marks:
                  </strong>

                  <span>
                    {student.marks}
                  </span>

                </div>


                <div className="detail">

                  <strong>
                    Grade:
                  </strong>

                  <span>
                    {student.grade}
                  </span>

                </div>

              </div>

            ) : (

              <div className="student-card">

                <h2>
                  Loading student details...
                </h2>

                <p>
                  Please wait...
                </p>

              </div>

            )}

          </>

        )}


        {/* ====================================
            ADMIN
        ==================================== */}

        {user.role === "ADMIN" && (

          <>

            <h1>
              Admin
            </h1>


            {/* ADD STUDENT */}

            <div className="admin-form">

              <h2>
                Add Student
              </h2>

              <div className="form-row">

                <input
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(
                      e.target.value
                    )
                  }
                />


                <input
                  type="text"
                  placeholder="Student Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />


                <input
                  type="text"
                  placeholder="Branch"
                  value={branch}
                  onChange={(e) =>
                    setBranch(
                      e.target.value
                    )
                  }
                />


                <input
                  type="number"
                  placeholder="Marks"
                  value={marks}
                  onChange={(e) =>
                    setMarks(
                      e.target.value
                    )
                  }
                />


                <button
                  onClick={addStudent}
                >
                  Add Student
                </button>

              </div>

            </div>


            {/* SEARCH */}

            <div className="admin-search">

              <input
                type="text"
                placeholder="Search by Student ID or Name"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            {/* ALL STUDENTS */}

            <div className="student-table">

              <h2>
                All Students
              </h2>

              <table>

                <thead>

                  <tr>

                    <th>
                      Student ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Branch
                    </th>

                    <th>
                      Marks
                    </th>

                    <th>
                      Grade
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map(
                      (item) => (

                        <tr
                          key={item.id}
                        >

                          <td>
                            {item.studentId}
                          </td>

                          <td>
                            {item.name}
                          </td>

                          <td>
                            {item.branch}
                          </td>

                          <td>
                            {item.marks}
                          </td>

                          <td>
                            {item.grade}
                          </td>

                          <td>

                            <button
                              className="edit-button"
                              onClick={() =>
                                editStudent(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteStudent(
                                  item.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="no-data"
                      >
                        No students found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </div>

  );

}

export default Dashboard;