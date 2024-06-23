import React, { useState } from 'react';
import axios from 'axios';



const questions = [
  "How often do you travel?",
  "How much trash do you produce?",
  "How much energy do you consume?",
  "How much water do you use?",
  "Do you have plants at home?",
];

const Questionnaire: React.FC<{ setScores: (scores: { [key: string]: number }) => void }> = ({ setScores }) => {

  const mockApiCall = async (answers: string[]) => {
    const apiResponse = await Promise.all([axios.post("https://chat-api.you.com/research", {
      query: `Assume the role of a bot trying to measure the carbon footprint of a person, based on their description of how they travel everyday, rate that person's Carbon Footprint in the range of 0 to 100. The person's description is '${answers[0]}'. Generate only a two-digit number, no other explanation or reasoning is required.`,
      chat_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a"
    }, {
      headers: {
        "X-API-Key": "65c95fb3-7f81-4a01-9419-b6f150340e56<__>1PTsFeETU8N2v5f4qmtDZVGS",
        "Content-Type": "application/json"
      }
    }),axios.post("https://chat-api.you.com/research", {
      query: `Assume the role of a bot trying to measure the carbon footprint of a person, based on their description of how much trash do they produce everyday, rate that person's Carbon Footprint in the range of 0 to 100. The person's description is '${answers[1]}'. Generate only a two-digit number, no other explanation or reasoning is required.`,
      chat_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a"
    }, {
      headers: {
        "X-API-Key": "65c95fb3-7f81-4a01-9419-b6f150340e56<__>1PTsFeETU8N2v5f4qmtDZVGS",
        "Content-Type": "application/json"
      }
    }),axios.post("https://chat-api.you.com/research", {
      query: `Assume the role of a bot trying to measure the carbon footprint of a person, based on their description of how much energy do they consume everyday, rate that person's Carbon Footprint in the range of 0 to 100. The person's description is '${answers[2]}'. Generate only a two-digit number, no other explanation or reasoning is required.`,
      chat_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a"
    }, {
      headers: {
        "X-API-Key": "65c95fb3-7f81-4a01-9419-b6f150340e56<__>1PTsFeETU8N2v5f4qmtDZVGS",
        "Content-Type": "application/json"
      }
    }),axios.post("https://chat-api.you.com/research", {
      query: `Assume the role of a bot trying to measure the carbon footprint of a person, based on their description of how much water they use everyday, rate that person's Carbon Footprint in the range of 0 to 100. The person's description is '${answers[3]}'. Generate only a two-digit number, no other explanation or reasoning is required.`,
      chat_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a"
    }, {
      headers: {
        "X-API-Key": "65c95fb3-7f81-4a01-9419-b6f150340e56<__>1PTsFeETU8N2v5f4qmtDZVGS",
        "Content-Type": "application/json"
      }
    }),axios.post("https://chat-api.you.com/research", {
      query: `Assume the role of a bot trying to measure the carbon footprint of a person, based on their description about how many plants do they have at home, rate that person's Carbon Footprint in the range of 0 to 100. The person's description is '${answers[4]}'. Generate only a two-digit number, no other explanation or reasoning is required.`,
      chat_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a"
    }, {
      headers: {
        "X-API-Key": "65c95fb3-7f81-4a01-9419-b6f150340e56<__>1PTsFeETU8N2v5f4qmtDZVGS",
        "Content-Type": "application/json"
      }
    })]);
  
    console.log(apiResponse)
  
    // const travelScore = apiResponse.data.travel || Math.floor(Math.random() * 100);
  
    return {
      travel:  Math.floor(Math.random() * 100),
      trash: Math.floor(Math.random() * 100),
      energy: Math.floor(Math.random() * 100),
      water: Math.floor(Math.random() * 100),
      plant: Math.floor(Math.random() * 100),
    };
  };
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
