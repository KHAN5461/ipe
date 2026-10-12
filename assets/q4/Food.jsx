function Food({ food, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <img
        src={food.image}
        alt={food.name}
        className="card-img-top bg-light"
        style={{ height: "160px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-warning text-dark">{food.category}</span>
          <span className="badge bg-success">⭐ {food.rating}</span>
        </div>
        <h5 className="card-title fw-bold text-dark">{food.name}</h5>
        <p className="card-text text-danger fw-bold fs-5 mb-1">₹{food.price}</p>
        <p className="card-text text-muted small flex-grow-1 text-truncate">
          {food.cuisine} cuisine &bull; {food.cookTimeMinutes} mins prep
        </p>
        <button className="btn btn-outline-warning text-dark btn-sm fw-bold mt-2" onClick={() => onSelect(food)}>
          Food Details &rarr;
        </button>
      </div>
    </div>
  );
}

export default Food;
