import React, { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);

  return (
    <div className="App">
      {!scores ? (
        <Questionnaire setScores={setScores} />
      ) : (
        <>
          <Results scores={scores} />
          <Chat />
        </>
      )}
    </div>
  );
};

export default App;
