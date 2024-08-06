const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const studentsFilePath = path.join(__dirname, '../data/students.json');

// Read and parse the students JSON file
const readStudentsFile = () => {
  return JSON.parse(fs.readFileSync(studentsFilePath, 'utf-8')).students;
};
router.get('/students', (req, res) => {
    try {
      const students = readStudentsFile();
      res.json(students);
    } catch (error) {
      console.log('Failed to retrieve students:');
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  });
module.exports = router;