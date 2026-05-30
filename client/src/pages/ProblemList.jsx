import { useEffect, useState } from 'react';
import { useProblemStore } from '../store/problemStore';
import './ProblemList.css';

export default function ProblemList({ onSelectProblem }) {
  const [filter, setFilter] = useState('all');
  const { problems, isLoadingProblems, problemsError, fetchProblems } = useProblemStore();

  useEffect(() => {
    const difficulty = filter === 'all' ? null : filter;
    fetchProblems(difficulty);
  }, [filter, fetchProblems]);

  const difficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '#22c55e';
      case 'medium':
        return '#eab308';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="problem-list-container">
      <div className="problem-list-header">
        <h1>DSA DryRun Problems</h1>
        <p>Select a problem to start learning with interactive execution traces</p>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({problems.length})
        </button>
        <button
          className={`filter-btn ${filter === 'easy' ? 'active' : ''}`}
          onClick={() => setFilter('easy')}
        >
          Easy
        </button>
        <button
          className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
          onClick={() => setFilter('medium')}
        >
          Medium
        </button>
        <button
          className={`filter-btn ${filter === 'hard' ? 'active' : ''}`}
          onClick={() => setFilter('hard')}
        >
          Hard
        </button>
      </div>

      {problemsError && (
        <div className="error-message">
          ❌ Error loading problems: {problemsError}
        </div>
      )}

      {isLoadingProblems && (
        <div className="loading">Loading problems...</div>
      )}

      <div className="problems-grid">
        {!isLoadingProblems && problems.map((problem) => (
          <div
            key={problem.id}
            className="problem-card"
            onClick={() => onSelectProblem(problem.id)}
          >
            <div className="problem-card-header">
              <h2>{problem.title}</h2>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: difficultyColor(problem.difficulty) }}
              >
                {problem.difficulty}
              </span>
            </div>
            <p className="problem-description">
              {problem.description.substring(0, 150)}...
            </p>
            <div className="problem-tags">
              {problem.tags && problem.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {problem.tags && problem.tags.length > 3 && (
                <span className="tag">+{problem.tags.length - 3}</span>
              )}
            </div>
            <button className="select-btn">Start Problem →</button>
          </div>
        ))}
      </div>

      {!isLoadingProblems && problems.length === 0 && (
        <div className="no-problems">
          No problems found. Try changing your filters.
        </div>
      )}
    </div>
  );
}
