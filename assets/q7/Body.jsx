import { useState, useEffect } from "react";
import Article from "./Article";

function Body() {
  const [page, setPage] = useState("news");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/posts?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = (data.posts || []).map((p) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          category: (p.tags && p.tags[0]) ? p.tags[0].toUpperCase() : "GENERAL",
          views: p.views || 150,
          likes: p.reactions?.likes || 25,
          author: "International News Correspondent",
          date: "Oct 12, 2026"
        }));
        setArticles(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch news articles from API");
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(articles.map((a) => a.category))];

  const filtered = category === "All"
    ? articles
    : articles.filter((a) => a.category === category);

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-danger mb-0 me-3">📰 Global Chronicle</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "news" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("news")}>News Feed</button>
          <button className={`btn btn-sm ${page === "categories" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("categories")}>Categories</button>
          <button className={`btn btn-sm ${page === "about" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setPage("about")}>About</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-danger fw-bold">Daily News Reader Application</h2>
          <p className="text-muted mt-2">Latest global dispatches, category filtering, and complete article details fetched via REST API.</p>
          <div className="mt-2">
            <button className="btn btn-danger" onClick={() => setPage("news")}>Read News Feed &rarr;</button>
          </div>
        </div>
      )}

      {page === "news" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Latest Dispatches</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/posts</code></small>
            </div>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted">Retrieving news dispatches from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((item) => (
                <div key={item.id} className="col-md-4">
                  <Article
                    article={item}
                    onSelect={(a) => {
                      setSelectedArticle(a);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedArticle && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-danger fs-6">{selectedArticle.category}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("news")}>
              &larr; Back to News
            </button>
          </div>
          <h2 className="fw-bold text-dark">{selectedArticle.title}</h2>
          <p className="text-muted small">Reported by {selectedArticle.author} &bull; {selectedArticle.date} &bull; 👁️ {selectedArticle.views} Views &bull; ❤️ {selectedArticle.likes} Likes</p>
          <hr />
          <h5 className="fw-bold text-dark">Full Article Coverage</h5>
          <p className="text-secondary fs-5 leading-relaxed">{selectedArticle.body}</p>
          <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => setPage("news")}>
              Read Other Stories
            </button>
          </div>
        </div>
      )}

      {page === "categories" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">News Beats & Categories</h4>
          <div className="row g-3">
            {categories.filter((c) => c !== "All").map((cat) => (
              <div key={cat} className="col-md-4">
                <div className="border p-3 rounded text-center bg-light">
                  <h5 className="fw-bold text-danger">{cat}</h5>
                  <p className="small text-muted mb-2">Live dispatches tagged under {cat}.</p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setCategory(cat);
                      setPage("news");
                    }}
                  >
                    View Stories
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "about" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark">About Global Chronicle</h4>
          <p className="text-muted mt-2">
            News reader application retrieving news dispatches via REST API, providing complete article views, category filtering, and routing.
          </p>
          <button className="btn btn-outline-danger btn-sm align-self-start" onClick={() => setPage("home")}>Back to Home</button>
        </div>
      )}
    </main>
  );
}

export default Body;