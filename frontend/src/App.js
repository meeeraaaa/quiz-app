import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Quiz from './components/Quiz';
import ThankYou from './components/ThankYou';
import ViewResults from './components/ViewResults';
import AddQuestionForm from './components/AddQuestionForm';
import ViewStudents from './components/ViewStudents';
import ViewQuiz from './components/ViewQuiz';
import './App.css'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/view-results" element={<ViewResults />} />
        <Route path="/add-question" element={<AddQuestionForm />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/view-students" element={<ViewStudents />} />
      <Route path="/view-quiz" element={<ViewQuiz />} />
      </Routes>
    </Router>
  );
};

export default App;
