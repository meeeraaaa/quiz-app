import React, { useState } from 'react';

const Admin = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      question,
      options,
      answer: options[0]
    };

    const response = await fetch('/api/quiz/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion)
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div  className="container">
    <form onSubmit={handleSubmit}>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" required />
      {options.map((option, idx) => (
        <input key={idx} type="text" value={option} onChange={(e) => setOptions(options.map((opt, i) => i === idx ? e.target.value : opt))} placeholder={`Option ${idx + 1}`} required />
      ))}
      <button type="submit">Add Question</button>
    </form></div>
  );
};
export default Admin;
