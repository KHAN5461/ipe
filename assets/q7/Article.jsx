function Article({ article, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-danger">{article.category}</span>
          <small className="text-muted">👁️ {article.views} Views</small>
        </div>
        <h5 className="card-title fw-bold text-dark">{article.title}</h5>
        <p className="card-text text-muted small flex-grow-1 text-truncate">{article.body}</p>
        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
          <small className="text-muted">❤️ {article.likes} Likes</small>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onSelect(article)}>
            Read Article &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Article;
