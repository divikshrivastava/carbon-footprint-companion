import React, { useState } from 'react';

const mockApiCall = async (answers: string[]) => {
  return new Promise<{ [key: string]: number }>((resolve) => {
    //To implement you.com API
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
  "How often do you travel?",
  "How much trash do you produce?",
  "How much energy do you consume?",
  "How much water do you use?",
  "Do you have plants at home?",
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

  return (
    <div>
      <h1>Carbon Footprint Questionnaire</h1>
      <p>{questions[currentQuestion]}</p>
      <input type="text" value={answers[currentQuestion]} onChange={handleChange} />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Questionnaire;
