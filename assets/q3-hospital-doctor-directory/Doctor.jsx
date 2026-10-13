function Doctor({ doctor, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-danger mb-2 align-self-start">{doctor.department}</span>
        <h5 className="card-title fw-bold text-dark">{doctor.name}</h5>
        <p className="card-text text-muted small mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
        <p className="card-text text-muted small mb-1"><strong>Experience:</strong> {doctor.experience}</p>
        <p className="card-text text-muted small mb-2"><strong>Availability:</strong> {doctor.availability}</p>
        <p className="card-text text-muted small flex-grow-1"><strong>Contact:</strong> {doctor.phone}</p>
        <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => onSelect(doctor)}>
          Doctor Information &rarr;
        </button>
      </div>
    </div>
  );
}

export default Doctor;
