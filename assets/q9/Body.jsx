import { useState, useEffect } from "react";
import Team from "./Team";

function Body() {
  const [page, setPage] = useState("teams");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sports teams");
        return res.json();
      })
      .then((data) => {
        const sports = ["Cricket", "Football", "Basketball", "Hockey", "Tennis"];
        const mapped = data.map((u, i) => ({
          id: u.id,
          name: `${u.company.name} Sports Club`,
          sport: sports[i % sports.length],
          captain: u.name,
          titles: (u.id * 2) % 6 + 1,
          stadium: `${u.address.city} Memorial Stadium`,
          city: u.address.city,
          email: u.email,
          phone: u.phone,
          website: u.website,
          description: `Premier franchise based in ${u.address.city}. Motto: "${u.company.catchPhrase}". Organization: ${u.company.bs}.`
        }));
        setTeams(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.captain.toLowerCase().includes(search.toLowerCase());
    const matchesSport = sportFilter === "All" || t.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  return (
    <main className="container my-4">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border">
        <span className="navbar-brand fw-bold text-primary mb-0 me-3">🏏 Sports Team Portal</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "teams" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("teams")}>Teams</button>
          <button className={`btn btn-sm ${page === "players" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("players")}>Players</button>
          <button className={`btn btn-sm ${page === "details" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("details")} disabled={!selectedTeam}>Team Information</button>
        </div>
      </nav>

      {/* 1. Home View */}
      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-primary fw-bold">Welcome to Sports Team Portal</h2>
          <p className="text-muted mt-2">Explore top athletic franchises, star team captains, home stadiums, and championship titles.</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-primary" onClick={() => setPage("teams")}>Browse All Teams &rarr;</button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("players")}>View Star Players</button>
          </div>
        </div>
      )}

      {/* 2. Teams View */}
      {page === "teams" && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h4 className="fw-bold mb-0">Franchises & Clubs ({filteredTeams.length})</h4>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search team or captain..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "220px" }}
              />
              <select
                className="form-select form-select-sm"
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                style={{ width: "140px" }}
              >
                <option value="All">All Sports</option>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Hockey">Hockey</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center my-4 py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 small">Fetching team roster from REST API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {!loading && !error && filteredTeams.length === 0 && (
            <div className="alert alert-warning py-3 text-center">No sports teams found matching your filter criteria.</div>
          )}

          <div className="row g-3">
            {filteredTeams.map((team) => (
              <div key={team.id} className="col-md-4">
                <Team
                  team={team}
                  onSelect={(t) => {
                    setSelectedTeam(t);
                    setPage("details");
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Team Details View */}
      {page === "details" && selectedTeam && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-primary fs-6">{selectedTeam.sport}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("teams")}>
              &larr; Back to Teams
            </button>
          </div>
          <h3 className="fw-bold text-dark">{selectedTeam.name}</h3>
          <p className="lead text-muted mb-3">{selectedTeam.description}</p>
          <div className="row g-3 my-2">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded border">
                <p className="mb-1"><strong>Team Captain:</strong> {selectedTeam.captain}</p>
                <p className="mb-1"><strong>Home Stadium:</strong> {selectedTeam.stadium}</p>
                <p className="mb-0"><strong>City:</strong> {selectedTeam.city}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded border">
                <p className="mb-1"><strong>Championship Titles:</strong> 🏆 {selectedTeam.titles} Trophies</p>
                <p className="mb-1"><strong>Official Contact:</strong> {selectedTeam.email}</p>
                <p className="mb-0"><strong>Website:</strong> {selectedTeam.website}</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={() => alert(`Enrolled as official fan of ${selectedTeam.name}!`)}>
              Join Fan Club
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("teams")}>
              Back to Team Directory
            </button>
          </div>
        </div>
      )}

      {/* 4. Players View */}
      {page === "players" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark mb-3">Team Captains & Key Roster</h4>
          <div className="row g-3">
            {teams.map((t) => (
              <div key={t.id} className="col-md-4">
                <div className="border p-3 rounded bg-light h-100">
                  <span className="badge bg-secondary mb-2">{t.sport}</span>
                  <h6 className="fw-bold mb-1">{t.captain}</h6>
                  <p className="text-muted small mb-1">Captain &bull; {t.name}</p>
                  <p className="small text-secondary mb-0">📧 {t.email}</p>
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
