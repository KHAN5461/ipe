function Product({ product, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="card-img-top bg-light p-3"
        style={{ height: "160px", objectFit: "contain" }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">{product.category}</span>
        <h5 className="card-title fw-bold text-dark">{product.title}</h5>
        <p className="card-text text-primary fw-bold fs-5 mb-1">${product.price}</p>
        <p className="card-text text-muted small mb-2">⭐ {product.rating} / 5.0 &bull; {product.brand || "Brand"}</p>
        <p className="card-text text-muted small flex-grow-1 text-truncate">{product.description}</p>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => onSelect(product)}>
          View Product Details &rarr;
        </button>
      </div>
    </div>
  );
}

export default Product;
