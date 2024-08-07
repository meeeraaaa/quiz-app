import React, { useState, useEffect } from 'react';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ username: '', score: 0 });
  const [showAddStudent, setShowAddStudent] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${username}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setStudents((prev) => prev.filter((student) => student.username !== username));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const student = await response.json();
      setStudents((prev) => [...prev, student]);
      setNewStudent({ username: '', score: 0 }); // Reset to default values
      setShowAddStudent(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.username}>
              <td>{student.username}</td>
              <td>{student.score}</td>
              <td>
                <button onClick={() => handleDelete(student.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowAddStudent(!showAddStudent)}>Add New Student</button>
      {showAddStudent && (
        <div>
          <h3>Add Student</h3>
          <input
            type="text"
            value={newStudent.username}
            onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="number"
            value={newStudent.score}
            onChange={(e) => setNewStudent({ ...newStudent, score: parseInt(e.target.value, 10) || 0 })}
            placeholder="Score"
          />
          <button onClick={handleAddStudent}>Add</button>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
