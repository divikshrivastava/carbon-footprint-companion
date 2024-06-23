import React from 'react';

const Results: React.FC<{ scores: { [key: string]: number } }> = ({ scores }) => {
  return (
    <div>
      <h1>Your Carbon Footprint Scores</h1>
      <ul>
        {Object.keys(scores).map((key) => (
          <li key={key}>
            {key}: {scores[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
