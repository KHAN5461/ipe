import { useState, useEffect } from "react";
import Movie from "./Movie";

function Body() {
  const [page, setPage] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/posts?limit=9")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const posters = [
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop"
        ];
        const genres = ["Sci-Fi / Space", "Action / Thriller", "Crime / Mystery", "Drama / Adventure"];
        const titles = ["Interstellar Journey", "Inception Mindscape", "Dark Knight Vengeance", "Blade Runner 2049", "The Matrix Reloaded", "Avatar Frontiers", "Dune Arrakis", "Oppenheimer Atomic", "Gladiator Rome"];

        const list = (data.posts || []).map((p, i) => ({
          id: p.id,
          title: titles[i % titles.length],
          genre: (p.tags && p.tags[0]) ? p.tags.join(" / ").toUpperCase() : genres[i % genres.length],
          rating: (8.2 + (i * 0.1)).toFixed(1),
          year: 2012 + (i * 2),
          director: "Christopher Nolan",
          duration: `${140 + i * 5} min`,
          description: p.body,
          poster: posters[i % posters.length]
        }));
        setMovies(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch movies from API");
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (m) => {
    if (favorites.some((f) => f.id === m.id)) {
      setFavorites(favorites.filter((f) => f.id !== m.id));
    } else {
      setFavorites([...favorites, m]);
    }
  };

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-dark mb-0 me-3">🎬 CineStream</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-dark text-white fw-bold" : "btn-outline-dark"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "movies" ? "btn-dark text-white fw-bold" : "btn-outline-dark"}`} onClick={() => setPage("movies")}>Movies</button>
          <button className={`btn btn-sm ${page === "favorites" ? "btn-dark text-white fw-bold" : "btn-outline-dark"}`} onClick={() => setPage("favorites")}>Favorites ({favorites.length})</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-dark fw-bold">Movie Explorer Application</h2>
          <p className="text-muted mt-2">Browse feature films, inspect ratings, and manage your favorites list fetched from REST API.</p>
          <div className="mt-2">
            <button className="btn btn-dark" onClick={() => setPage("movies")}>Browse Movies &rarr;</button>
          </div>
        </div>
      )}

      {page === "movies" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Feature Films</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/posts</code> (Cinematic Entries)</small>
            </div>
            <input
              className="form-control"
              style={{ maxWidth: "260px" }}
              placeholder="Search movie title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status"></div>
              <p className="mt-2 text-muted">Retrieving movie list from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((item) => (
                <div key={item.id} className="col-md-4">
                  <Movie
                    movie={item}
                    onSelect={(m) => {
                      setSelectedMovie(m);
                      setPage("details");
                    }}
                    onToggleFav={toggleFavorite}
                    isFav={favorites.some((f) => f.id === item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedMovie && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-warning text-dark fs-6">⭐ {selectedMovie.rating} / 10 IMDb</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("movies")}>
              &larr; Back to Movies
            </button>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="img-fluid rounded border shadow-sm"
                style={{ maxHeight: "280px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              <h2 className="fw-bold text-dark">{selectedMovie.title}</h2>
              <p className="text-muted mb-2"><strong>Release Year:</strong> {selectedMovie.year} &bull; <strong>Genre:</strong> {selectedMovie.genre}</p>
              <p className="text-muted mb-2"><strong>Director:</strong> {selectedMovie.director} &bull; <strong>Duration:</strong> {selectedMovie.duration}</p>
              <hr />
              <h5 className="fw-bold text-dark">Plot Synopsis & Description</h5>
              <p className="text-secondary leading-relaxed">{selectedMovie.description}</p>
              <div className="d-flex gap-2 mt-4">
                <button
                  className={`btn ${favorites.some((f) => f.id === selectedMovie.id) ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => toggleFavorite(selectedMovie)}
                >
                  {favorites.some((f) => f.id === selectedMovie.id) ? "❤️ Remove from Favorites" : "🤍 Save to Favorites"}
                </button>
                <button className="btn btn-secondary" onClick={() => setPage("movies")}>
                  Back to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "favorites" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">Favorite Movies ({favorites.length})</h4>
          {!favorites.length ? (
            <p className="text-muted">No movies added to favorites yet. <button className="btn btn-link btn-sm p-0" onClick={() => setPage("movies")}>Browse Movies</button></p>
          ) : (
            <div className="row g-3">
              {favorites.map((fav) => (
                <div key={fav.id} className="col-md-4">
                  <div className="card h-100 p-3 bg-light border">
                    <h5 className="fw-bold text-dark">{fav.title}</h5>
                    <p className="small text-muted mb-1">{fav.genre} &bull; {fav.year}</p>
                    <p className="small text-warning fw-bold mb-2">⭐ {fav.rating} / 10</p>
                    <button className="btn btn-sm btn-outline-danger mt-auto" onClick={() => toggleFavorite(fav)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Body;