import { useState, useEffect } from "react";
import Food from "./Food";

function Body() {
  const [page, setPage] = useState("menu");
  const [menu, setMenu] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/recipes?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = (data.recipes || []).map((r, i) => ({
          id: r.id,
          name: r.name,
          category: r.mealType ? r.mealType[0] : "Dinner",
          cuisine: r.cuisine || "Continental",
          price: 180 + (i * 30),
          rating: r.rating || 4.7,
          cookTimeMinutes: r.cookTimeMinutes || 25,
          image: r.image,
          ingredients: r.ingredients || [],
          instructions: r.instructions || []
        }));
        setMenu(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch recipes from API");
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(menu.map((m) => m.category))];

  const filtered = selectedCategory === "All"
    ? menu
    : menu.filter((item) => item.category === selectedCategory);

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-dark mb-0 me-3">🍔 Gourmet Bistro</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-warning text-dark fw-bold" : "btn-outline-warning text-dark"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "menu" ? "btn-warning text-dark fw-bold" : "btn-outline-warning text-dark"}`} onClick={() => setPage("menu")}>Menu</button>
          <button className={`btn btn-sm ${page === "categories" ? "btn-warning text-dark fw-bold" : "btn-outline-warning text-dark"}`} onClick={() => setPage("categories")}>Categories</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-dark fw-bold">Restaurant Menu Explorer</h2>
          <p className="text-muted mt-2">Discover curated recipes, cuisines, preparation details, and customer reviews from DummyJSON REST API.</p>
          <div className="mt-2">
            <button className="btn btn-warning text-dark fw-bold" onClick={() => setPage("menu")}>Explore Menu Items &rarr;</button>
          </div>
        </div>
      )}

      {page === "menu" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Restaurant Menu</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/recipes</code></small>
            </div>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted">Retrieving restaurant menu from API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((item) => (
                <div key={item.id} className="col-md-4">
                  <Food
                    food={item}
                    onSelect={(f) => {
                      setSelectedFood(f);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedFood && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-warning text-dark fs-6">{selectedFood.category}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("menu")}>
              &larr; Back to Menu
            </button>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                className="img-fluid rounded border shadow-sm"
                style={{ maxHeight: "250px", width: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              <h3 className="fw-bold text-dark">{selectedFood.name}</h3>
              <h4 className="text-danger fw-bold my-2">₹{selectedFood.price}</h4>
              <p className="text-muted mb-1"><strong>Cuisine:</strong> {selectedFood.cuisine} &bull; <strong>Prep Time:</strong> {selectedFood.cookTimeMinutes} mins</p>
              <p className="text-muted mb-3"><strong>Rating:</strong> ⭐ {selectedFood.rating} / 5.0</p>
              <h6 className="fw-bold">Key Ingredients:</h6>
              <p className="small text-secondary">{selectedFood.ingredients.join(", ")}</p>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-warning text-dark fw-bold" onClick={() => alert(`Ordered ${selectedFood.name}!`)}>
                  Order Item Now
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setPage("menu")}>
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "categories" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">Menu Categories</h4>
          <div className="row g-3">
            {categories.filter((c) => c !== "All").map((cat) => (
              <div key={cat} className="col-md-4">
                <div className="border p-3 rounded text-center bg-light">
                  <h5 className="fw-bold text-dark">{cat}</h5>
                  <p className="small text-muted mb-2">Selected dishes in {cat} category.</p>
                  <button
                    className="btn btn-sm btn-outline-warning text-dark fw-bold"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage("menu");
                    }}
                  >
                    View Dishes
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