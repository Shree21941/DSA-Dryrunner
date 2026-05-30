import './TestResults.css';

export default function TestResults({ results, isLoading, status }) {
  if (isLoading) {
    return (
      <div className="test-results-container">
        <div className="running">
          <div className="spinner"></div>
          <p>Running test cases...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { testsPassed, testsFailed, totalTests, results: testResults, error } = results;

  if (error) {
    return (
      <div className="test-results-container">
        <div className="error-box">
          <h3>❌ Execution Error</h3>
          <pre>{error}</pre>
        </div>
      </div>
    );
  }

  const statusClass = status === 'accepted' ? 'passed' : 'failed';
  const statusIcon = status === 'accepted' ? '✅' : '❌';
  const statusText = status === 'accepted' ? 'All Tests Passed!' : `${testsFailed} Test(s) Failed`;

  return (
    <div className="test-results-container">
      <div className={`results-header ${statusClass}`}>
        <div className="status">
          <span className="status-icon">{statusIcon}</span>
          <span className="status-text">{statusText}</span>
        </div>
        <div className="summary">
          {testsPassed}/{totalTests} tests passed
        </div>
      </div>

      <div className="results-list">
        {testResults && testResults.map((test) => (
          <div
            key={test.testNumber}
            className={`test-case ${test.passed ? 'passed' : 'failed'}`}
          >
            <div className="test-header">
              <span className="test-icon">{test.passed ? '✓' : '✗'}</span>
              <span className="test-name">Test Case {test.testNumber}</span>
              <span className={`test-status ${test.passed ? 'pass' : 'fail'}`}>
                {test.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div className="test-details">
              <div className="test-section">
                <span className="label">Input:</span>
                <pre className="test-value">{test.input}</pre>
              </div>

              <div className="test-section">
                <span className="label">Expected Output:</span>
                <pre className="test-value">{test.expected}</pre>
              </div>

              {test.actual !== null && (
                <div className="test-section">
                  <span className="label">Your Output:</span>
                  <pre className={`test-value ${test.passed ? 'match' : 'no-match'}`}>
                    {typeof test.actual === 'object'
                      ? JSON.stringify(test.actual)
                      : String(test.actual)}
                  </pre>
                </div>
              )}

              {test.error && (
                <div className="test-section error">
                  <span className="label">Error:</span>
                  <pre className="test-value">{test.error}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="results-footer">
        <div className="stats">
          <div className="stat passed">
            <span className="number">{testsPassed}</span>
            <span className="label">Passed</span>
          </div>
          <div className="stat failed">
            <span className="number">{testsFailed}</span>
            <span className="label">Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
