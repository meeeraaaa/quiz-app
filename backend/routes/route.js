const jwt = require('jsonwebtoken');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dbPath = path.join(__dirname, '../data/db.json');
let db = require(dbPath);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Token is missing' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Authentication Routes
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.admins.find(admin => admin.username === username && admin.password === password);
  if (admin) {
    const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  const student = db.students.find(student => student.username === username && student.password === password);
  if (student) {
    const token = jwt.sign({ username: student.username, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Quiz Routes
router.get('/quiz', (req, res) => {
  res.json(db.quiz); // quiz questions
});
router.post('/quiz', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access forbidden' });

  const newQuestion = req.body;
  if (!newQuestion.question || !newQuestion.options || !newQuestion.answer) {
    return res.status(400).json({ message: 'Invalid question format' });
  }
  newQuestion.id = db.quiz.length ? db.quiz[db.quiz.length - 1].id + 1 : 1;
  db.quiz.push(newQuestion);
  fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ message: 'Failed to save data' });
    }
    res.status(201).json({ success: true, newQuestion });
  });
 });
// router.delete('/quiz/:id', authenticateJWT, (req, res) => {
//   const { id } = req.params;
//   const questionIndex = db.quiz.findIndex(q => q.id === parseInt(id, 10));
//   if (questionIndex !== -1) {
//     db.quiz.splice(questionIndex, 1);
//     fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing to db.json:', err);
//         return res.status(500).json({ message: 'Failed to save data' });
//       }
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).json({ message: 'Question not found' });
//   }
// });
router.delete('/quiz/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access forbidden' });

  const { id } = req.params;
  const questionIndex = db.quiz.findIndex(q => q.id === parseInt(id, 10));
  if (questionIndex !== -1) {
    db.quiz.splice(questionIndex, 1);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.status(204).end();
    });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

// Student Routes
router.get('/students', authenticateJWT, (req, res) => {
  if (req.user.role === 'admin') {
    const studentsWithScores = db.students.map(student => ({
      username: student.username,
      score: student.score || 0,
    }));
    res.json(studentsWithScores);
  } else {
    res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
});

router.get('/students/:username', authenticateJWT, (req, res) => {
  if (req.user.username === req.params.username || req.user.role === 'admin') {
    const student = db.students.find(s => s.username === req.params.username);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else {
    res.status(403).json({ message: 'Access forbidden' });
  }
});

router.put('/students/:username/score', authenticateJWT, (req, res) => {
  if (req.user.username === req.params.username || req.user.role === 'admin') {
    const { score } = req.body;
    let student = db.students.find(s => s.username === req.params.username);
    if (student) {
      student.score = score;
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error('Error writing to db.json:', err);
          return res.status(500).json({ message: 'Failed to save data' });
        }
        res.json(student);
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else {
    res.status(403).json({ message: 'Access forbidden' });
  }
});

router.post('/students', authenticateJWT, (req, res) => {
  if (req.user.role === 'admin') {
    const { username, score } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    const existingStudent = db.students.find(s => s.username === username);
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }
    const newStudent = { username, score: score || 0 };
    db.students.push(newStudent);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.status(201).json(newStudent);
    });
  } else {
    res.status(403).json({ message: 'Access forbidden' });
  }
});

router.delete('/students/:username', authenticateJWT, (req, res) => {
  if (req.user.role === 'admin') {
    const { username } = req.params;
    const studentIndex = db.students.findIndex(s => s.username === username);
    if (studentIndex !== -1) {
      db.students.splice(studentIndex, 1);
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error('Error writing to db.json:', err);
          return res.status(500).json({ message: 'Failed to save data' });
        }
        res.status(204).end();
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } else {
    res.status(403).json({ message: 'Access forbidden' });
  }
});

router.post('/quiz/submit', (req, res) => {
  const { username, answers } = req.body;
  let student = db.students.find(student => student.username === username);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  let score = 0;
  answers.forEach(answer => {
    const question = db.quiz.find(q => q.id === answer.id);
    if (question && question.answer === answer.answer) {
      score += 1;
    }
  });
  student.score = score;
  fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ message: 'Failed to save data' });
    }
    res.status(200).json({ success: true, score });
  });
});

module.exports = router;
