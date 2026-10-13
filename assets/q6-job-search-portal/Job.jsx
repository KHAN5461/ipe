function Job({ job, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">{job.location}</span>
        <h5 className="card-title fw-bold text-dark">{job.title}</h5>
        <h6 className="card-subtitle text-primary mb-2">{job.company}</h6>
        <p className="card-text text-success fw-bold mb-1">{job.salary}</p>
        <p className="card-text text-muted small mb-2"><strong>Skills:</strong> {job.skills}</p>
        <p className="card-text text-muted small flex-grow-1 text-truncate">{job.description}</p>
        <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => onSelect(job)}>
          Job Details &rarr;
        </button>
      </div>
    </div>
  );
}

export default Job;
