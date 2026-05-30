import { useEffect, useState } from 'react';
import { useProblemStore } from '../store/problemStore';
import { useExecutionStore } from '../store/executionStore';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import './ProblemDetail.css';

export default function ProblemDetail({ problemId, onBack }) {
  const { currentProblem, isLoadingProblem, problemError, fetchProblemById, clearCurrentProblem } =
    useProblemStore();
  const { code, setCode, testResults, isExecuting, executionError, submitExecution, resetExecution } =
    useExecutionStore();
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);

  useEffect(() => {
    if (problemId) {
      fetchProblemById(problemId);
      resetExecution();
      setCode('');
    }
    return () => {
      clearCurrentProblem();
    };
  }, [problemId, fetchProblemById, clearCurrentProblem, resetExecution, setCode]);

  if (isLoadingProblem) {
    return <div className="loading-container">Loading problem...</div>;
  }

  if (problemError) {
    return (
      <div className="error-container">
        <p>❌ Error: {problemError}</p>
        <button onClick={onBack} className="back-btn">
          ← Back to Problems
        </button>
      </div>
    );
  }

  if (!currentProblem) {
    return null;
  }

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

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    try {
      await submitExecution(code, problemId, 'javascript');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const handleResetCode = () => {
    setCode(currentProblem.starter_code);
  };

  const handleCopyStarter = () => {
    navigator.clipboard.writeText(currentProblem.starter_code);
    alert('Starter code copied to clipboard!');
  };

  return (
    <div className="problem-detail-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Problems
      </button>

      <div className="problem-detail-content">
        {/* Problem Statement Section */}
        <div className="problem-statement-section">
          <div className="problem-title-bar">
            <h1>{currentProblem.title}</h1>
            <span
              className="difficulty-badge"
              style={{ backgroundColor: difficultyColor(currentProblem.difficulty) }}
            >
              {currentProblem.difficulty.toUpperCase()}
            </span>
          </div>

          <div className="complexity-info">
            <div className="complexity-item">
              <span className="label">Time Complexity:</span>
              <span className="value">{currentProblem.time_complexity}</span>
            </div>
            <div className="complexity-item">
              <span className="label">Space Complexity:</span>
              <span className="value">{currentProblem.space_complexity}</span>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{currentProblem.description}</p>
          </div>

          <div className="tags-section">
            <h3>Topics</h3>
            <div className="tags">
              {currentProblem.tags &&
                currentProblem.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <div className="test-cases-section">
            <h3>Test Cases</h3>
            <div className="test-case-tabs">
              {currentProblem.testCases &&
                currentProblem.testCases.map((test, index) => (
                  <button
                    key={index}
                    className={`test-case-tab ${selectedTestCaseIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedTestCaseIndex(index)}
                  >
                    Test Case {index + 1}
                  </button>
                ))}
            </div>

            {currentProblem.testCases && currentProblem.testCases[selectedTestCaseIndex] && (
              <div className="test-case-content">
                <div className="test-case-item">
                  <h4>Input</h4>
                  <pre>{currentProblem.testCases[selectedTestCaseIndex].input}</pre>
                </div>
                <div className="test-case-item">
                  <h4>Expected Output</h4>
                  <pre>{currentProblem.testCases[selectedTestCaseIndex].expected_output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor & Execution Section */}
        <div className="editor-section">
          <CodeEditor 
            starterCode={currentProblem.starter_code}
            languageCodes={currentProblem.language_codes || {}}
          />

          <div className="execution-controls">
            <button onClick={handleRunCode} className="run-btn" disabled={isExecuting}>
              {isExecuting ? '⏳ Running...' : '▶ Run Code'}
            </button>
            <button onClick={handleResetCode} className="reset-btn" disabled={isExecuting}>
              ↺ Reset Code
            </button>
            <button onClick={handleCopyStarter} className="copy-btn" disabled={isExecuting}>
              📋 Copy Starter
            </button>
          </div>

          {executionError && (
            <div className="execution-error">
              <p>❌ {executionError}</p>
            </div>
          )}

          {testResults && testResults.results && (
            <TestResults
              results={testResults.results}
              isLoading={isExecuting}
              status={testResults.status}
            />
          )}
        </div>
      </div>
    </div>
  );
}
