import { useState, useEffect } from "react";
import Destination from "./Destination";

function Body() {
  const [page, setPage] = useState("destinations");
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
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
        const seasons = ["Spring (March - May)", "Autumn (Sept - Nov)", "Winter (Dec - Feb)", "Summer (June - Aug)"];
        const list = (data.users || []).map((u, i) => ({
          id: u.id,
          city: u.address ? u.address.city : "Metropolis",
          state: u.address ? u.address.state : "Coastal Region",
          country: u.address ? u.address.country : "International",
          packageCost: (35000 + i * 8500).toLocaleString(),
          season: seasons[i % seasons.length],
          highlights: `Historic architecture, landmark tours, scenic countryside of ${u.address?.city || 'the region'}.`
        }));
        setDestinations(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to retrieve destinations from API");
        setLoading(false);
      });
  }, []);

  const filtered = destinations.filter((d) =>
    d.city.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-info text-dark mb-0 me-3">✈️ Wanderlust Travel</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-info text-dark fw-bold" : "btn-outline-info text-dark"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "destinations" ? "btn-info text-dark fw-bold" : "btn-outline-info text-dark"}`} onClick={() => setPage("destinations")}>Destinations</button>
          <button className={`btn btn-sm ${page === "packages" ? "btn-info text-dark fw-bold" : "btn-outline-info text-dark"}`} onClick={() => setPage("packages")}>Packages</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-info fw-bold">Travel Destination Explorer</h2>
          <p className="text-muted mt-2">Discover popular holiday destinations, visiting seasons, and tour packages fetched from REST API.</p>
          <div className="mt-2">
            <button className="btn btn-info text-dark fw-bold" onClick={() => setPage("destinations")}>Explore Places &rarr;</button>
          </div>
        </div>
      )}

      {page === "destinations" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Tour Destinations</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/users</code> (Global Locations)</small>
            </div>
            <input
              className="form-control"
              style={{ maxWidth: "260px" }}
              placeholder="Search destination or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status"></div>
              <p className="mt-2 text-muted">Retrieving destinations from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((dest) => (
                <div key={dest.id} className="col-md-4">
                  <Destination
                    destination={dest}
                    onSelect={(d) => {
                      setSelectedDest(d);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedDest && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-info text-dark fs-6">{selectedDest.country}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("destinations")}>
              &larr; Back to Destinations
            </button>
          </div>
          <h3 className="fw-bold text-dark">{selectedDest.city}, {selectedDest.state}</h3>
          <p className="text-muted mb-1"><strong>Best Visiting Season:</strong> {selectedDest.season}</p>
          <p className="text-primary fw-bold fs-5 mb-2">Estimated Package Cost: ₹{selectedDest.packageCost}</p>
          <hr />
          <h5 className="fw-bold text-dark">Travel Itinerary Overview</h5>
          <p className="text-secondary">{selectedDest.highlights}</p>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-info text-dark fw-bold" onClick={() => alert(`Package booking initiated for ${selectedDest.city}!`)}>
              Book Holiday Package
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("destinations")}>
              Back to Places
            </button>
          </div>
        </div>
      )}

      {page === "packages" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">Curated Tour Packages</h4>
          <div className="row g-3">
            {[
              { title: "Coastal Horizon Tour", duration: "5 Days / 4 Nights", cost: "₹45,000", desc: "Beachside accommodation with island hopping tours." },
              { title: "Metropolitan Heritage Trail", duration: "6 Days / 5 Nights", cost: "₹58,000", desc: "Museum passes, cultural dining, and architectural tours." },
              { title: "Highland Wilderness Safari", duration: "7 Days / 6 Nights", cost: "₹69,000", desc: "Mountain treks, lake cruises, and scenic nature walks." }
            ].map((p, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 p-3 bg-light border">
                  <h5 className="fw-bold text-dark">{p.title}</h5>
                  <span className="badge bg-secondary mb-2 align-self-start">{p.duration}</span>
                  <p className="small text-muted flex-grow-1">{p.desc}</p>
                  <strong className="text-primary fs-5">{p.cost}</strong>
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