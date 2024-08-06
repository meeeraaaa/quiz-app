const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const studentsRoutes = require('./routes/students');
const cors = require('cors');
const path = require('path');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

// Route registrations
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/students', studentsRoutes);

// Serve static files (if any) and handle other routes
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
