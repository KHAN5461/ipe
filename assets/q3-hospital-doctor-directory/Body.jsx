import { useState, useEffect } from "react";
import Doctor from "./Doctor";

function Body() {
  const [page, setPage] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const depts = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"];
        const specs = ["Senior Cardiologist", "Consultant Neurologist", "Pediatric Specialist", "Joint Replacement Surgeon"];
        const list = data.map((u, i) => ({
          id: u.id,
          name: `Dr. ${u.name}`,
          email: u.email,
          phone: u.phone,
          department: depts[i % depts.length],
          specialization: specs[i % specs.length],
          experience: `${6 + (i * 2)} Years`,
          availability: ["Mon - Fri (10 AM - 2 PM)", "Tue - Sat (2 PM - 6 PM)", "Daily (9 AM - 1 PM)"][i % 3],
          hospitalRoom: `OPD Clinic #${101 + i}`
        }));
        setDoctors(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch doctors from API");
        setLoading(false);
      });
  }, []);

  const filtered = department === "All"
    ? doctors
    : doctors.filter((d) => d.department === department);

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-danger mb-0 me-3">🏥 MedCare Hospital</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "doctors" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("doctors")}>Doctors</button>
          <button className={`btn btn-sm ${page === "departments" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("departments")}>Departments</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-danger fw-bold">Hospital Doctor Directory</h2>
          <p className="text-muted mt-2">Find specialists, consultation timings, availability, and clinical contacts fetched via REST API.</p>
          <div className="mt-2">
            <button className="btn btn-danger" onClick={() => setPage("doctors")}>View Doctor Roster &rarr;</button>
          </div>
        </div>
      )}

      {page === "doctors" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Doctor Directory</h4>
              <small className="text-muted">Live REST API: <code>https://jsonplaceholder.typicode.com/users</code></small>
            </div>
            <select
              className="form-select"
              style={{ maxWidth: "220px" }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted">Retrieving doctor directory from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((item) => (
                <div key={item.id} className="col-md-4">
                  <Doctor
                    doctor={item}
                    onSelect={(d) => {
                      setSelectedDoctor(d);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedDoctor && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-danger fs-6">{selectedDoctor.department} Department</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("doctors")}>
              &larr; Back to Doctor List
            </button>
          </div>
          <h3 className="fw-bold text-dark">{selectedDoctor.name}</h3>
          <h5 className="text-danger">{selectedDoctor.specialization}</h5>
          <hr />
          <div className="row g-3">
            <div className="col-md-6">
              <p className="mb-2"><strong>Clinical Experience:</strong> {selectedDoctor.experience}</p>
              <p className="mb-2"><strong>OPD Availability:</strong> {selectedDoctor.availability}</p>
              <p className="mb-2"><strong>Location / Clinic:</strong> {selectedDoctor.hospitalRoom}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-2"><strong>Contact Number:</strong> {selectedDoctor.phone}</p>
              <p className="mb-2"><strong>Doctor Email:</strong> {selectedDoctor.email}</p>
              <p className="mb-2"><strong>Consultation Fee:</strong> ₹1,200</p>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-danger" onClick={() => alert(`Appointment booked with ${selectedDoctor.name}!`)}>
              Book Consultation
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("doctors")}>
              Back to Doctors
            </button>
          </div>
        </div>
      )}

      {page === "departments" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">Hospital Departments</h4>
          <div className="row g-3">
            {["Cardiology", "Neurology", "Pediatrics", "Orthopedics"].map((dept) => (
              <div key={dept} className="col-md-3">
                <div className="border p-3 rounded text-center bg-light">
                  <h5 className="fw-bold text-danger">{dept}</h5>
                  <p className="small text-muted mb-2">Specialist consultations & OPD.</p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setDepartment(dept);
                      setPage("doctors");
                    }}
                  >
                    View Doctors
                  </button>
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