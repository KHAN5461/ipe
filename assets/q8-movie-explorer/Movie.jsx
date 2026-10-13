function Movie({ movie, onSelect, onToggleFav, isFav }) {
  return (
    <div className="card h-100 shadow-sm border">
      <img
        src={movie.poster}
        alt={movie.title}
        className="card-img-top bg-dark"
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-secondary">{movie.year}</span>
          <span className="badge bg-warning text-dark">⭐ {movie.rating} / 10</span>
        </div>
        <h5 className="card-title fw-bold text-dark">{movie.title}</h5>
        <p className="card-text text-muted small mb-2"><strong>Genre:</strong> {movie.genre}</p>
        <p className="card-text text-muted small flex-grow-1 text-truncate">{movie.description}</p>
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-outline-warning text-dark btn-sm flex-fill fw-bold" onClick={() => onSelect(movie)}>
            Movie Details &rarr;
          </button>
          <button
            className={`btn btn-sm ${isFav ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => onToggleFav(movie)}
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Movie;
