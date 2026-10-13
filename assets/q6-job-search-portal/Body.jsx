import { useState, useEffect } from "react";
import Job from "./Job";

function Body() {
  const [page, setPage] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
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
        const skillsList = ["React, TypeScript, Redux", "Node.js, Express, MongoDB", "Python, Django, AWS", "DevOps, Docker, Kubernetes"];
        const list = (data.users || []).map((u, i) => ({
          id: u.id,
          title: u.company?.title || "Software Engineer",
          company: u.company?.name || "Global Tech Solutions",
          location: u.address?.city || "Bengaluru",
          salary: `₹${18 + (i * 2)} - ${24 + (i * 2)} LPA`,
          skills: skillsList[i % skillsList.length],
          description: `Responsible for designing robust ${u.company?.department || "engineering"} systems, architectural design, and agile code reviews.`
        }));
        setJobs(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to retrieve job listings from API");
        setLoading(false);
      });
  }, []);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-primary mb-0 me-3">💼 CareerHub</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "jobs" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("jobs")}>Jobs</button>
          <button className={`btn btn-sm ${page === "about" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("about")}>About</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-primary fw-bold">Job Search Portal</h2>
          <p className="text-muted mt-2">Find software engineering job openings across premier tech firms fetched from live REST API.</p>
          <div className="mt-2">
            <button className="btn btn-primary" onClick={() => setPage("jobs")}>Search Jobs &rarr;</button>
          </div>
        </div>
      )}

      {page === "jobs" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Open Positions</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/users</code> (Corporate Roles)</small>
            </div>
            <input
              className="form-control"
              style={{ maxWidth: "280px" }}
              placeholder="Filter by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Retrieving job opportunities from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((job) => (
                <div key={job.id} className="col-md-4">
                  <Job
                    job={job}
                    onSelect={(j) => {
                      setSelectedJob(j);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedJob && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-secondary fs-6">{selectedJob.location}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("jobs")}>
              &larr; Back to Job Listings
            </button>
          </div>
          <h3 className="fw-bold text-dark">{selectedJob.title}</h3>
          <h5 className="text-primary">{selectedJob.company}</h5>
          <h5 className="text-success fw-bold my-2">{selectedJob.salary}</h5>
          <p className="text-muted mb-2"><strong>Required Technical Skills:</strong> {selectedJob.skills}</p>
          <hr />
          <h5 className="fw-bold text-dark">Job Role & Responsibilities</h5>
          <p className="text-secondary leading-relaxed">{selectedJob.description}</p>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" onClick={() => alert(`Application submitted for ${selectedJob.title} at ${selectedJob.company}!`)}>
              Submit Job Application
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("jobs")}>
              Back to Openings
            </button>
          </div>
        </div>
      )}

      {page === "about" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark">About CareerHub Portal</h4>
          <p className="text-muted mt-2">
            Job search portal application displaying job title, company, location, salary package, required skills, and role descriptions retrieved via REST API.
          </p>
          <button className="btn btn-outline-primary btn-sm align-self-start" onClick={() => setPage("home")}>Back to Home</button>
        </div>
      )}
    </main>
  );
}

export default Body;
