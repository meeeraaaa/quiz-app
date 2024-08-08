import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Optionally redirect to login if username is not found
      navigate('/login');
    }
  }, [navigate]);

  const startQuiz = () => {
    // Assuming you have a way to get the number of questions
    const numberOfQuestions = 10; // Replace this with the actual number of questions
    const totalTime = 45 * numberOfQuestions * 1000; // Total time in milliseconds

    navigate('/quiz', { state: { totalTime } });
  };

  return (
    <div className="student-dashboard-container">
      <header className="student-dashboard-header">
        Welcome, {username}!
      </header>
      <div className="student-dashboard">
        <button className="start-quiz-button" onClick={startQuiz}>Start Quiz</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
