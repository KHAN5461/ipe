import { useState, useEffect } from "react";
import Student from "./Student";

function Body() {
  const [page, setPage] = useState("students");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/users?limit=9")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const departments = [
          "Computer Engineering",
          "Information Technology",
          "AI & Data Science",
          "Electronics Engineering"
        ];
        const courses = [
          "Full Stack Web Development",
          "Data Structures & Algorithms",
          "Database Management Systems",
          "Cloud Computing & DevOps",
          "Artificial Intelligence",
          "Computer Networks & Security"
        ];

        const mapped = (data.users || []).map((u, i) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          rollNo: `2024-CO-${String(u.id).padStart(3, "0")}`,
          department: departments[i % departments.length],
          semester: `Semester ${(i % 4) * 2 + 1}`,
          cgpa: (8.2 + (i % 15) * 0.1).toFixed(2),
          email: u.email,
          phone: u.phone,
          university: u.university || "Kalsekar Technical Campus",
          photo: u.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          course: courses[i % courses.length],
          credits: 4,
          bio: `Undergraduate engineering student enrolled in ${courses[i % courses.length]} at ${u.university || "University Campus"}.`
        }));
        setStudents(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to retrieve student records from API");
        setLoading(false);
      });
  }, []);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <main className="container my-4">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-success mb-0 me-3">🎓 Student Academic Portal</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "students" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("students")}>Students</button>
          <button className={`btn btn-sm ${page === "courses" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("courses")}>Courses</button>
          <button className={`btn btn-sm ${page === "details" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("details")} disabled={!selectedStudent}>Student Profile</button>
        </div>
      </nav>

      {/* 1. Home View */}
      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-success fw-bold">Student Profile & Course Portal</h2>
          <p className="text-muted mt-2">Manage student profiles, academic courses, CGPA records, and enrollment info fetched live via REST API.</p>
          <div className="d-flex justify-content-center gap-2 mt-2">
            <button className="btn btn-success" onClick={() => setPage("students")}>Explore Student Directory &rarr;</button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("courses")}>View Enrolled Courses</button>
          </div>
        </div>
      )}

      {/* 2. Students Directory View */}
      {page === "students" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Student Directory ({filtered.length})</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/users</code></small>
            </div>
            <div className="d-flex gap-2">
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: "220px" }}
                placeholder="Search name, roll no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                style={{ width: "190px" }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Retrieving student records from REST API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="alert alert-warning py-3 text-center">No students found matching your search.</div>
          )}

          <div className="row g-3">
            {filtered.map((item) => (
              <div key={item.id} className="col-md-4">
                <Student
                  student={item}
                  onSelect={(s) => {
                    setSelectedStudent(s);
                    setPage("details");
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Student Profile Details View */}
      {page === "details" && selectedStudent && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-success fs-6">{selectedStudent.department}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("students")}>
              &larr; Back to Student Directory
            </button>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-md-3 text-center">
              <img
                src={selectedStudent.photo}
                alt={selectedStudent.name}
                className="img-fluid rounded shadow border"
                style={{ maxHeight: "180px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
                }}
              />
              <h5 className="fw-bold mt-2 mb-0">{selectedStudent.name}</h5>
              <span className="badge bg-primary mt-1">{selectedStudent.rollNo}</span>
            </div>
            <div className="col-md-9">
              <div className="p-3 bg-light rounded border mb-3">
                <div className="row g-2">
                  <div className="col-sm-6">
                    <p className="mb-1"><strong>Academic Semester:</strong> {selectedStudent.semester}</p>
                    <p className="mb-1"><strong>Cumulative GPA:</strong> 🌟 {selectedStudent.cgpa} / 10.0</p>
                    <p className="mb-1"><strong>Major Course:</strong> {selectedStudent.course}</p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-1"><strong>Email:</strong> {selectedStudent.email}</p>
                    <p className="mb-1"><strong>Contact Phone:</strong> {selectedStudent.phone}</p>
                    <p className="mb-1"><strong>University:</strong> {selectedStudent.university}</p>
                  </div>
                </div>
              </div>
              <p className="text-secondary">{selectedStudent.bio}</p>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success" onClick={() => alert(`Generated Grade Card for ${selectedStudent.name}!`)}>
                  Download Grade Card
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setPage("students")}>
                  Back to Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Academic Courses View */}
      {page === "courses" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark mb-3">Offered Academic Courses & Curriculum</h4>
          <div className="row g-3">
            {[
              { code: "CS-301", title: "Full Stack Web Development", credits: 4, faculty: "Prof. M. Ansari" },
              { code: "CS-302", title: "Data Structures & Algorithms", credits: 4, faculty: "Prof. S. Khan" },
              { code: "CS-303", title: "Database Management Systems", credits: 3, faculty: "Prof. R. Shaikh" },
              { code: "CS-304", title: "Cloud Computing & DevOps", credits: 3, faculty: "Prof. A. Patel" },
              { code: "CS-305", title: "Artificial Intelligence", credits: 4, faculty: "Prof. N. Deshmukh" },
              { code: "CS-306", title: "Computer Networks & Security", credits: 3, faculty: "Prof. K. Verma" }
            ].map((c) => (
              <div key={c.code} className="col-md-4">
                <div className="border p-3 rounded bg-light h-100">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-secondary">{c.code}</span>
                    <span className="badge bg-success">{c.credits} Credits</span>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{c.title}</h6>
                  <p className="small text-muted mb-0">Instructor: {c.faculty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Body;