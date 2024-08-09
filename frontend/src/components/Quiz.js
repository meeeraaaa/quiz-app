import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [attemptedCount, setAttemptedCount] = useState(0); // Count of attempted questions
  const navigate = useNavigate();
  const location = useLocation();
  const { totalTime } = location.state || { totalTime: 0 };
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/thankyou'); // thank you page when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000); // decrease time by 1 sec
    }, 1000);

    return () => clearInterval(timer); // Clean up timer on component unmount
  }, [timeLeft, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quiz');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestions(data);
        setAnswers(new Array(data.length).fill(''));
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const username = localStorage.getItem('username');

  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      
      if (newAnswers[index] === '' && value !== '') {
        setAttemptedCount((prevCount) => prevCount + 1);
      }
  
      newAnswers[index] = value;
      return newAnswers;
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header with the JWT token
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
      alert('Quiz submitted successfully');
      navigate('/thankyou'); 
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  return (
    <div className="quiz-container">
      <div className="sidebar-container">
        <ul className="question-list">
          {questions.map((q, index) => (
            <li key={q.id}>
              <button
                className={`question-button ${index === currentQuestionIndex ? 'active' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                Question {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Quiz Time!</h1>
          <p className="username-studentdashboard">{username}</p>
          <p className="progress-counter">
            {Math.ceil(attemptedCount / 2)} / {questions.length} attempted
          </p>
          <div className="time-left">
            Time left: {Math.floor(timeLeft / 1000)} seconds
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="question-container">
            <p className="question-text">{questions[currentQuestionIndex]?.question}</p>
            {questions[currentQuestionIndex]?.options.map((option, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`question-${questions[currentQuestionIndex].id}`}
                  value={option}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={() => handleChange(currentQuestionIndex, option)}
                  className="option-input"
                />
                {option}
              </label>
            ))}
          </div>

          <div className="button-container">
            <button type="button" onClick={handleNextQuestion} className="next-button">
              Next Question
            </button>
          </div>
        </form>

        <div className="submit-container">
          <button onClick={handleSubmit} className="submit-button">
            Submit Quiz
          </button>
        </div>
        
        {submitted && (
          <p className="thank-you-message">
            Thank you for taking the quiz! You attempted {Math.ceil(attemptedCount / 2)} out of {questions.length} questions.
          </p>
        )}
      </div>
    </div>
  );
};

export default Quiz;