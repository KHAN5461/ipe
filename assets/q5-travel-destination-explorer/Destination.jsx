function Destination({ destination, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-info text-dark mb-2 align-self-start">{destination.country}</span>
        <h5 className="card-title fw-bold text-dark">{destination.city}</h5>
        <p className="card-text text-muted small mb-1"><strong>Region / State:</strong> {destination.state}</p>
        <p className="card-text text-muted small mb-2"><strong>Package Cost:</strong> ₹{destination.packageCost}</p>
        <p className="card-text text-muted small flex-grow-1"><strong>Best Season:</strong> {destination.season}</p>
        <button className="btn btn-outline-info text-dark btn-sm fw-bold mt-2" onClick={() => onSelect(destination)}>
          Destination Info &rarr;
        </button>
      </div>
    </div>
  );
}

export default Destination;
