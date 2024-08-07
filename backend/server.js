const routes = require('./routes/route');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api', routes); 
// Serve static files (if any) and handle other routes
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});