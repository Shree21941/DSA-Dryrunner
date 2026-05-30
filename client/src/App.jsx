import { useState } from 'react';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleSelectProblem = (problemId) => {
    setSelectedProblemId(problemId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProblemId(null);
  };

  return (
    <div className="app">
      {currentView === 'list' ? (
        <ProblemList onSelectProblem={handleSelectProblem} />
      ) : (
        <ProblemDetail problemId={selectedProblemId} onBack={handleBackToList} />
      )}
    </div>
  );
}

export default App;
