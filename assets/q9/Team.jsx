function Team({ team, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-primary">{team.sport}</span>
          <span className="badge bg-warning text-dark">🏆 {team.titles} Titles</span>
        </div>
        <h5 className="card-title fw-bold text-dark">{team.name}</h5>
        <p className="card-text text-muted small mb-1"><strong>Captain:</strong> {team.captain}</p>
        <p className="card-text text-muted small mb-1"><strong>Home Stadium:</strong> {team.stadium}</p>
        <p className="card-text text-secondary small flex-grow-1 text-truncate mt-1">{team.description}</p>
        <button className="btn btn-outline-primary btn-sm mt-3 w-100" onClick={() => onSelect(team)}>
          Team Information &rarr;
        </button>
      </div>
    </div>
  );
}

export default Team;
