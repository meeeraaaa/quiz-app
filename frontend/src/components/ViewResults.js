import React, { useEffect, useState } from 'react';

const ViewResults = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log('Error fetching students:', error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Student Results</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.username}</td>
              <td>{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
