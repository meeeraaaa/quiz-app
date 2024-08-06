const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const studentsFilePath = path.join(__dirname, '../data/students.json');
const adminsFilePath = path.join(__dirname, '../data/admin.json');

// Read JSON files
const readStudentsFile = () => {
  return JSON.parse(fs.readFileSync(studentsFilePath, 'utf-8'));
};

const readAdminsFile = () => {
  return JSON.parse(fs.readFileSync(adminsFilePath, 'utf-8'));
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const students = readStudentsFile();
  const admins = readAdminsFile();

  // Check if user is an admin
  const admin = admins.find((admin) => admin.username === username && admin.password === password);
  if (admin) {
    return res.json({ success: true, role: 'admin' });
  }

  // Check if user is a student
  const student = students.find((student) => student.username === username && student.password === password);
  if (student) {
    return res.json({ success: true, role: 'student' });
  }

  // If no match
  res.status(401).json({ success: false, message: 'Invalid username or password' });
});

module.exports = router;
