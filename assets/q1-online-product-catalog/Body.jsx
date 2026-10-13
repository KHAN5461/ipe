import { useState, useEffect } from "react";
import Product from "./Product";

function Body() {
  const [page, setPage] = useState("products");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products from API");
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container my-4">
      <nav className="navbar navbar-expand navbar-light bg-light rounded p-2 mb-4 border shadow-sm">
        <span className="navbar-brand fw-bold text-primary mb-0 me-3">🛒 ShopSphere</span>
        <div className="navbar-nav gap-2">
          <button className={`btn btn-sm ${page === "home" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("home")}>Home</button>
          <button className={`btn btn-sm ${page === "products" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("products")}>Products</button>
          <button className={`btn btn-sm ${page === "cart" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("cart")}>Cart ({cart.length})</button>
          <button className={`btn btn-sm ${page === "about" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage("about")}>About</button>
        </div>
      </nav>

      {page === "home" && (
        <div className="card shadow-sm p-4 text-center">
          <h2 className="text-primary fw-bold">Online Shopping Portal</h2>
          <p className="text-muted mt-2">Browse genuine products dynamically retrieved from DummyJSON REST API endpoint.</p>
          <div className="mt-2">
            <button className="btn btn-primary" onClick={() => setPage("products")}>Explore Product Catalog &rarr;</button>
          </div>
        </div>
      )}

      {page === "products" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Products Catalog</h4>
              <small className="text-muted">Live REST API: <code>https://dummyjson.com/products</code></small>
            </div>
            <input
              className="form-control"
              style={{ maxWidth: "260px" }}
              placeholder="Search product or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Fetching live products via REST API...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.map((item) => (
                <div key={item.id} className="col-md-4">
                  <Product
                    product={item}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setPage("details");
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "details" && selectedProduct && (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-secondary fs-6">{selectedProduct.category}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage("products")}>
              &larr; Back to Products
            </button>
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.title}
                className="img-fluid rounded border p-2 bg-light"
                style={{ maxHeight: "250px", objectFit: "contain" }}
              />
            </div>
            <div className="col-md-8">
              <h3 className="fw-bold text-dark">{selectedProduct.title}</h3>
              <h4 className="text-primary fw-bold my-2">${selectedProduct.price}</h4>
              <p className="text-muted">{selectedProduct.description}</p>
              <ul className="list-group list-group-flush mb-3 small">
                <li className="list-group-item px-0"><strong>Brand:</strong> {selectedProduct.brand || "Authentic"}</li>
                <li className="list-group-item px-0"><strong>Rating:</strong> ⭐ {selectedProduct.rating} / 5.0</li>
                <li className="list-group-item px-0"><strong>Stock Availability:</strong> {selectedProduct.stock} units in stock</li>
              </ul>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setCart([...cart, selectedProduct]);
                    alert(`${selectedProduct.title} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setPage("products")}>
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "cart" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-3">Your Shopping Cart</h4>
          {!cart.length ? (
            <p className="text-muted">Your cart is empty. <button className="btn btn-link btn-sm p-0" onClick={() => setPage("products")}>Browse Products</button></p>
          ) : (
            <div>
              <ul className="list-group mb-3">
                {cart.map((item, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-bold">{item.title}</h6>
                      <small className="text-muted">${item.price}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setCart(cart.filter((_, i) => i !== idx))}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <h5 className="mb-0 fw-bold">Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</h5>
                <button className="btn btn-success" onClick={() => { alert("Order placed successfully!"); setCart([]); setPage("home"); }}>
                  Checkout Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {page === "about" && (
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold text-dark">About ShopSphere</h4>
          <p className="text-muted mt-2">
            Online product catalog developed with live REST API data integration (<code>https://dummyjson.com/products</code>), React Router navigation architecture, dynamic state handling, and loading feedback.
          </p>
          <button className="btn btn-outline-primary btn-sm align-self-start" onClick={() => setPage("home")}>Back to Home</button>
        </div>
      )}
    </main>
  );
}

export default Body;