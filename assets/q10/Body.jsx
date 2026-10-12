import { useState, useEffect } from "react";
import Book from "./Book";

function Body() {
  const [page, setPage] = useState("books");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://openlibrary.org/search.json?q=computer+science&limit=12")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books from OpenLibrary API");
        return res.json();
      })
      .then((data) => {
        const mapped = (data.docs || []).map((b, index) => ({
          id: b.key || index,
          title: b.title || "Untitled Volume",
          author: b.author_name ? b.author_name.slice(0, 2).join(", ") : "Unknown Scholar",
          year: b.first_publish_year || 2020,
          isbn: b.isbn ? b.isbn[0] : `ISBN-${9780000000000 + index}`,
          publisher: b.publisher ? b.publisher[0] : "Academic Press",
          price: ((b.first_publish_year ? b.first_publish_year % 35 : 15) + 12).toFixed(2),
          availability: index % 4 === 0 ? "Reserved" : "Available in Library",
          category: "Computer Science",
          coverUrl: b.cover_i
            ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
            : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
          description: `Archived technical publication covering computing disciplines, data structures, and computer science methodologies first cataloged in ${b.first_publish_year || 'recent editions'}.`
        }));
        setBooks(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container my-4">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border">
        <span className="navbar-brand fw-bold text-success mb-0 me-3">📚 Digital Library</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "books" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("books")}>Books</button>
          <button className={`btn btn-sm ${page === "authors" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("authors")}>Authors</button>
          <button className={`btn btn-sm ${page === "details" ? "btn-success" : "btn-outline-success"}`} onClick={() => setPage("details")} disabled={!selectedBook}>Book Information</button>
        </div>
      </nav>

      {/* 1. Home View */}
      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-success fw-bold">Library Book Management Interface</h2>
          <p className="text-muted mt-2">Browse the university library collection fetched live from OpenLibrary REST API.</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-success" onClick={() => setPage("books")}>Search Books Catalog &rarr;</button>
            <button className="btn btn-outline-secondary" onClick={() => setPage("authors")}>View Featured Authors</button>
          </div>
        </div>
      )}

      {/* 2. Books Catalog View */}
      {page === "books" && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h4 className="fw-bold mb-0">Library Catalog ({filtered.length})</h4>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "260px" }}
            />
          </div>

          {loading && (
            <div className="text-center my-4 py-4">
              <div className="spinner-border text-success" role="status"></div>
              <p className="text-muted mt-2 small">Loading books from OpenLibrary API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="alert alert-warning py-3 text-center">No library volumes found matching "{search}".</div>
          )}

          <div className="row g-3">
            {filtered.map((item, idx) => (
              <div key={item.id || idx} className="col-md-4">
                <Book
                  book={item}
                  onSelect={(b) => {
                    setSelectedBook(b);
                    setPage("details");
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Book Details View */}
      {page === "details" && selectedBook && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-success fs-6">{selectedBook.category}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("books")}>
              &larr; Back to Books Catalog
            </button>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <img
                src={selectedBook.coverUrl}
                alt={selectedBook.title}
                className="img-fluid rounded shadow-sm border"
                style={{ maxHeight: "280px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
                }}
              />
            </div>
            <div className="col-md-8">
              <h3 className="fw-bold text-dark mb-2">{selectedBook.title}</h3>
              <p className="lead text-muted mb-2"><strong>Author:</strong> {selectedBook.author}</p>
              <div className="p-3 bg-light rounded border mb-3">
                <p className="mb-1"><strong>ISBN:</strong> {selectedBook.isbn}</p>
                <p className="mb-1"><strong>Publisher:</strong> {selectedBook.publisher}</p>
                <p className="mb-1"><strong>First Published:</strong> {selectedBook.year}</p>
                <p className="mb-1"><strong>Digital Access Fee:</strong> ${selectedBook.price}</p>
                <p className="mb-0"><strong>Status:</strong> <span className="badge bg-info text-dark">{selectedBook.availability}</span></p>
              </div>
              <p className="text-secondary">{selectedBook.description}</p>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success" onClick={() => alert(`Issued digital copy of "${selectedBook.title}"!`)}>
                  Issue Library Copy
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setPage("books")}>
                  Back to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Authors View */}
      {page === "authors" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark mb-3">Prominent Library Authors</h4>
          <div className="row g-3">
            {books.slice(0, 6).map((b, i) => (
              <div key={i} className="col-md-4">
                <div className="border p-3 rounded bg-light text-center h-100">
                  <h6 className="fw-bold text-dark mb-1">{b.author}</h6>
                  <p className="small text-muted mb-1">Author of <em>"{b.title}"</em></p>
                  <span className="badge bg-secondary">Catalog Year: {b.year}</span>
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
