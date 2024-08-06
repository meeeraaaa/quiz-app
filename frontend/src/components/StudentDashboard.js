import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ studentName }) => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div>
      <h2>Welcome, {studentName}!</h2>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};

export default StudentDashboard;
