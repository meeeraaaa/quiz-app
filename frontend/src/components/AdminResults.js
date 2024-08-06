import React, { useState, useEffect } from 'react';

const AdminResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch('/api/quiz/results');
      const data = await response.json();
      setResults(data);
    };
    fetchResults();
  }, []);

  return (
    <div className="container">
      <h2>Student Scores</h2>
      <ul>
        {results.map((result, idx) => (
          <li key={idx}>
            {result.username}: {result.score}/10
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminResults;
