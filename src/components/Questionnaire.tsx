import React, { useState } from 'react';
import './Questionnaire.css';
import botImage from './assets/bot.png';
import travelImage from './assets/travel.png';
import trashImage from './assets/trash.png';
import energyImage from './assets/energy.png';
import waterImage from './assets/water.png';
import plantImage from './assets/plant.png';

const mockApiCall = async (answers: string[]) => {
  return new Promise<{ [key: string]: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        travel: Math.floor(Math.random() * 100),
        trash: Math.floor(Math.random() * 100),
        energy: Math.floor(Math.random() * 100),
        water: Math.floor(Math.random() * 100),
        plant: Math.floor(Math.random() * 100),
      });
    }, 1000);
  });
};

const questions = [
  {
    question: "How often do you travel?",
    image: travelImage,
    fact: "Every year, millions of people use cars, which generates approximately 20 tonnes of carbon per person.",
  },
  {
    question: "How much trash do you produce?",
    image: trashImage,
    fact: "The average person produces 4.4 pounds of trash per day, contributing significantly to carbon emissions.",
  },
  {
    question: "How much energy do you consume?",
    image: energyImage,
    fact: "Household energy use is responsible for a large portion of an individual's carbon footprint.",
  },
  {
    question: "How much water do you use?",
    image: waterImage,
    fact: "Water usage contributes to carbon emissions due to the energy required to treat and transport it.",
  },
  {
    question: "Do you have plants at home?",
    image: plantImage,
    fact: "Having plants at home can help offset carbon emissions and improve air quality.",
  },
];

const Questionnaire: React.FC<{ setScores: (scores: { [key: string]: number }) => void }> = ({ setScores }) => {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const scores = await mockApiCall(answers);
      setScores(scores);
    }
  };

  const progress = (currentQuestion / questions.length) * 100;

  return (
    <div className="questionnaire-container">
      <h1>Carbon Footprint Questionnaire</h1>
      <img src={questions[currentQuestion].image} alt="Question Art" className="question-image" />
      <p className="question-text">{questions[currentQuestion].question}</p>
      <input type="text" value={answers[currentQuestion]} onChange={handleChange} className="question-input" />
      <button onClick={handleSubmit} className="next-button">Next</button>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="bot-container">
        <img src={botImage} alt="Bot" className="bot-image" />
        <div className="bot-speech-bubble">
          <p>{questions[currentQuestion].fact}</p>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
