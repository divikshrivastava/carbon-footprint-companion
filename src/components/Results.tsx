import React, { useState } from 'react';
import './Results.css';
import carIcon from './assets/car.svg';
import binIcon from './assets/bin.svg';
import bulbIcon from './assets/bulb.svg';
import waterIcon from './assets/water.svg';
import plantIcon from './assets/plant.svg';

const averageScores = {
  travel: 50,
  trash: 30,
  energy: 40,
  water: 60,
  plant: 70,
};

const mockProgress = [
  { date: "22 Jun", event: "Used bicycle to commute to work place thrice this week", impact: "-10 travel" },
  { date: "23 Jun", event: "Forgot to turn off water faucet", impact: "+20 water" },
  { date: "24 Jun", event: "Installed energy-efficient light bulbs", impact: "-15 energy" },
  { date: "25 Jun", event: "Reduced shower time by 5 minutes", impact: "-5 water" },
  { date: "26 Jun", event: "Recycled all plastic waste", impact: "-10 trash" },
  { date: "27 Jun", event: "Carpooled to work", impact: "-10 travel" },
  { date: "28 Jun", event: "Used public transport", impact: "-5 travel" },
  { date: "29 Jun", event: "Composted kitchen waste", impact: "-5 trash" },
  { date: "30 Jun", event: "Forgot to turn off lights", impact: "+10 energy" },
  { date: "1 Jul", event: "Planted a new tree", impact: "-20 plant" },
];

const Results: React.FC<{ scores: { [key: string]: number } }> = ({ scores }) => {
  const [showProgress, setShowProgress] = useState<boolean>(false);

  const toggleProgress = () => {
    setShowProgress(!showProgress);
  };

  const shareCarbonFootprint = () => {
    // Placeholder for share functionality
    alert("Sharing your carbon footprint!");
  };

  return (
    <div className="results-container">
      <div className="top-right-buttons">
        <button onClick={toggleProgress} className="progress-button">View Progress</button>
        <button onClick={shareCarbonFootprint} className="share-button">Share Your Carbon Footprint</button>
      </div>
      <h1>Your Carbon Footprint Scores</h1>
      <div className="score-item">
        <img src={carIcon} alt="Travel" className="icon" />
        <div className="score-bar">
          <div className="bar user-score" style={{ width: `${scores.travel}%` }}></div>
          <div className="bar average-score" style={{ width: `${averageScores.travel}%` }}></div>
          <span>{scores.travel}</span>
        </div>
      </div>
      <div className="score-item">
        <img src={binIcon} alt="Trash" className="icon" />
        <div className="score-bar">
          <div className="bar user-score" style={{ width: `${scores.trash}%` }}></div>
          <div className="bar average-score" style={{ width: `${averageScores.trash}%` }}></div>
          <span>{scores.trash}</span>
        </div>
      </div>
      <div className="score-item">
        <img src={bulbIcon} alt="Energy" className="icon" />
        <div className="score-bar">
          <div className="bar user-score" style={{ width: `${scores.energy}%` }}></div>
          <div className="bar average-score" style={{ width: `${averageScores.energy}%` }}></div>
          <span>{scores.energy}</span>
        </div>
      </div>
      <div className="score-item">
        <img src={waterIcon} alt="Water" className="icon" />
        <div className="score-bar">
          <div className="bar user-score" style={{ width: `${scores.water}%` }}></div>
          <div className="bar average-score" style={{ width: `${averageScores.water}%` }}></div>
          <span>{scores.water}</span>
        </div>
      </div>
      <div className="score-item">
        <img src={plantIcon} alt="Plant" className="icon" />
        <div className="score-bar">
          <div className="bar user-score" style={{ width: `${scores.plant}%` }}></div>
          <div className="bar average-score" style={{ width: `${averageScores.plant}%` }}></div>
          <span>{scores.plant}</span>
        </div>
      </div>

      {showProgress && (
        <div className="progress-modal">
          <div className="progress-modal-content">
            <span className="close" onClick={toggleProgress}>&times;</span>
            <h2>Progress</h2>
            <ul>
              {mockProgress.map((item, index) => (
                <li key={index}>
                  <strong>{item.date}:</strong> {item.event} ({item.impact})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
