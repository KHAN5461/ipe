function Student({ student, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column text-center">
        <img
          src={student.photo}
          alt={student.name}
          className="rounded-circle mx-auto mb-3 border shadow-sm"
          style={{ width: "90px", height: "90px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
          }}
        />
        <h5 className="card-title fw-bold text-dark mb-1">{student.name}</h5>
        <div className="d-flex justify-content-center gap-1 mb-2">
          <span className="badge bg-primary">{student.rollNo}</span>
          <span className="badge bg-success">CGPA: {student.cgpa}</span>
        </div>
        <p className="card-text text-muted small mb-1">
          <strong>Dept:</strong> {student.department} &bull; {student.semester}
        </p>
        <p className="card-text text-secondary small flex-grow-1 mb-3">
          <strong>Course:</strong> {student.course}
        </p>
        <button className="btn btn-outline-success btn-sm w-100 mt-auto" onClick={() => onSelect(student)}>
          Student Information &rarr;
        </button>
      </div>
    </div>
  );
}

export default Student;
