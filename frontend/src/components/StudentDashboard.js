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
    navigate('/quiz');
  };

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};

export default StudentDashboard;
