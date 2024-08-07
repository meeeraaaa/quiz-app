import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quiz');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestions(data);
        console.log(data)
        setAnswers(new Array(data.length).fill(''));
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username'); 
  
      const formattedAnswers = questions.map((q, index) => ({
        id: q.id,
        answer: answers[index],
      }));
  
      const score = formattedAnswers.reduce((acc, answer) => {
        const question = questions.find(q => q.id === answer.id);
        if (question && question.answer === answer.answer) {
          acc += 1;
        }
        return acc;
      }, 0);
  
      const response = await fetch(`http://localhost:5000/api/students/${username}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      alert('Quiz submitted successfully');
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };
  
  return (
    <div>
      <h1>Quiz Time!</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id}>
              <p>{q.question}</p>
              {q.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit Quiz</button>
        </form>
      ) : (
        <p>Thank you for taking the quiz!</p>
      )}
    </div>
  );
};

export default Quiz;
