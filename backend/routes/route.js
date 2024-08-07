const express = require('express');
const router = express.Router();
const fs = require('fs'); 
const path = require('path'); 
const dbPath = path.join(__dirname, '../data/db.json'); 
let db = require(dbPath); 

// Authentication Routes
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const admin = db.admins.find(admin => admin.username === username && admin.password === password);
  if (admin) {
    return res.json({ success: true, role: 'admin' });
  }

  const student = db.students.find(student => student.username === username && student.password === password);
  if (student) {
    return res.json({ success: true, role: 'student' });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Quiz Routes
router.get('/quiz', (req, res) => {
  res.json(db.quiz); // quiz questions
});
// Delete a quiz question
router.delete('/quiz/:id', (req, res) => {
    const { id } = req.params;
    const questionIndex = db.quiz.findIndex(q => q.id === parseInt(id, 10));
    
    if (questionIndex !== -1) {
      db.quiz.splice(questionIndex, 1);
  
      // Write the updated database back to the file
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
  
router.post('/quiz', (req, res) => {
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

// Student Routes
router.get('/students', (req, res) => {
    const studentsWithScores = db.students.map(student => ({
      username: student.username,
      score: student.score || 0, // Return score, or 0 if undefined
    }));
  
    res.json(studentsWithScores);
  });
  
router.get('/students/:username', (req, res) => {
  const student = db.students.find(s => s.username === req.params.username);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

router.put('/students/:username/score', (req, res) => {
  const { score } = req.body;
  let student = db.students.find(s => s.username === req.params.username);
  if (student) {
    student.score = score;

    // Write the updated database back to the db.json file
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
});
// Add a new student
router.post('/students', (req, res) => {
    const { username, score } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    // Check if the student already exists
    const existingStudent = db.students.find(s => s.username === username);
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }
  
    // Add the new student with a default score if not provided
    const newStudent = { username, score: score || 0 };
    db.students.push(newStudent);
  
    // Write the updated database back to the file
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.status(201).json(newStudent);
    });
  });
  
  // Delete a student
  router.delete('/students/:username', (req, res) => {
    const { username } = req.params;
    const studentIndex = db.students.findIndex(s => s.username === username);
    if (studentIndex !== -1) {
      db.students.splice(studentIndex, 1);
  
      // Write the updated database back to the file
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
  });
router.post('/quiz/submit', (req, res) => {
    const { username, answers } = req.body;
  
    // student's record
    let student = db.students.find(student => student.username === username);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    //  score
    let score = 0;
    answers.forEach(answer => {
      const question = db.quiz.find(q => q.id === answer.id);
      if (question && question.answer === answer.answer) {
        score += 1;
      }
    });
  
    // update score in student's record
    student.score = score;
  
    // Write the updated db back to the file
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.status(200).json({ success: true, score });
    });
  });
  

module.exports = router;
