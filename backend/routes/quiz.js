const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const quizFilePath = path.join(__dirname, '../data/quiz.json');
const studentsFilePath = path.join(__dirname, '../data/students.json');

// Read and parse the quiz JSON file
const readQuizFile = () => {
  return JSON.parse(fs.readFileSync(quizFilePath, 'utf-8'));
};

// Read and parse the students JSON file
const readStudentsFile = () => {
  return JSON.parse(fs.readFileSync(studentsFilePath, 'utf-8'));
};

// Write data to the quiz JSON file
const writeQuizFile = (data) => {
  fs.writeFileSync(quizFilePath, JSON.stringify(data, null, 2));
};

// Write data to the students JSON file
const writeStudentsFile = (data) => {
  fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2));
};

// Get all questions
router.get('/questions', (req, res) => {
  try {
    const quiz = readQuizFile();
    res.json(quiz.questions);
  } catch (error) {
    console.error('Failed to retrieve questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
});

// Add a new question
router.post('/questions', (req, res) => {
  const newQuestion = req.body;
  try {
    const quiz = readQuizFile();
    if (quiz.questions.length >= 10) {
      return res.status(400).json({ message: 'Maximum number of questions reached.' });
    }
    quiz.questions.push(newQuestion);
    writeQuizFile(quiz);
    res.json({ success: true, questions: quiz.questions });
  } catch (error) {
    console.error('Failed to add question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Submit quiz results
router.post('/submit', (req, res) => {
  const { username, answers } = req.body;
  console.log(req.body)
  try {
    let students = readStudentsFile();
    let student = students.find(stud => stud.username === username);
    
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Calculate score
    const quiz = readQuizFile();
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score++;
      }
    });

    // Update score
    student.score = score;
    writeStudentsFile(students);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to submit results:', error);
    res.status(500).json({ error: 'Failed to submit results' });
  }
});

router.get('/results', (req, res) => {
  try {
    const students = readStudentsFile();
    res.json(students);
  } catch (error) {
    console.error('Failed to retrieve results:', error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
});

module.exports = router;
