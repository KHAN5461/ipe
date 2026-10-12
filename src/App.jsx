import React, { useState } from 'react';

// Import all 10 IPE III Problem Statement Solutions from assets/
import Q1App from '../assets/q1/App.jsx';
import Q2App from '../assets/q2/App.jsx';
import Q3App from '../assets/q3/App.jsx';
import Q4App from '../assets/q4/App.jsx';
import Q5App from '../assets/q5/App.jsx';
import Q6App from '../assets/q6/App.jsx';
import Q7App from '../assets/q7/App.jsx';
import Q8App from '../assets/q8/App.jsx';
import Q9App from '../assets/q9/App.jsx';
import Q10App from '../assets/q10/App.jsx';

function App() {
  const [selectedQ, setSelectedQ] = useState('q1');

  const problems = [
    { id: 'q1', domain: 'E-Commerce', title: 'Q1: Online Product Catalog', comp: <Q1App /> },
    { id: 'q2', domain: 'Education', title: 'Q2: Student Course Portal', comp: <Q2App /> },
    { id: 'q3', domain: 'Healthcare', title: 'Q3: Hospital Doctor Directory', comp: <Q3App /> },
    { id: 'q4', domain: 'Food & Restaurant', title: 'Q4: Restaurant Menu Explorer', comp: <Q4App /> },
    { id: 'q5', domain: 'Travel', title: 'Q5: Travel Destination Explorer', comp: <Q5App /> },
    { id: 'q6', domain: 'Job Portal', title: 'Q6: Job Search Portal', comp: <Q6App /> },
    { id: 'q7', domain: 'News', title: 'Q7: News Reader Application', comp: <Q7App /> },
    { id: 'q8', domain: 'Entertainment', title: 'Q8: Movie Explorer', comp: <Q8App /> },
    { id: 'q9', domain: 'Sports', title: 'Q9: Sports Team Portal', comp: <Q9App /> },
    { id: 'q10', domain: 'Library', title: 'Q10: Digital Library', comp: <Q10App /> }
  ];

  const currentProblem = problems.find((p) => p.id === selectedQ) || problems[0];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Banner */}
      <header className="bg-dark text-white py-3 px-4 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <span className="fs-3">⚛️</span>
            <div>
              <h4 className="mb-0 fw-bold">Internal Practical Examination (IPE III)</h4>
              <small className="text-secondary">
                Routing & Navigation &bull; REST API Integration &bull; Data Handling
              </small>
            </div>
          </div>
          <span className="badge bg-success px-3 py-2 fs-6">
            All 15 Key Requirements Implemented
          </span>
        </div>
      </header>

      {/* Question Selector Bar */}
      <nav className="bg-white border-bottom shadow-sm px-4 py-2 sticky-top">
        <div className="container-fluid d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-semibold text-secondary small me-2">Select Problem Statement:</span>
          {problems.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedQ(p.id)}
              className={`btn btn-sm ${
                selectedQ === p.id ? 'btn-primary fw-bold shadow-sm' : 'btn-outline-secondary'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="container-fluid px-4 py-3 flex-grow-1">
        {currentProblem.comp}
      </main>

      {/* Bottom Footer */}
      <footer className="bg-white border-top text-center py-3 text-muted small mt-auto">
        Individual standalone question code organized into <code>assets/q1</code> through <code>assets/q10</code>
      </footer>
    </div>
  );
}

export default App;
