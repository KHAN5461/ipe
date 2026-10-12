function Book({ book, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <img
        src={book.coverUrl}
        className="card-img-top bg-light"
        alt={book.title}
        style={{ height: "180px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
        }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-success">{book.category}</span>
          <span className="badge bg-secondary">{book.year}</span>
        </div>
        <h6 className="card-title fw-bold text-dark text-truncate mb-1" title={book.title}>
          {book.title}
        </h6>
        <p className="card-text text-muted small mb-1">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="card-text text-success small fw-semibold mb-2">
          Price: ${book.price} &bull; <span className="text-primary">{book.availability}</span>
        </p>
        <button className="btn btn-outline-success btn-sm mt-auto w-100" onClick={() => onSelect(book)}>
          Book Information &rarr;
        </button>
      </div>
    </div>
  );
}

export default Book;
