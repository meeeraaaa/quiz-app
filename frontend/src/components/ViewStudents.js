import React, { useState, useEffect } from 'react';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ username: '', score: 0, password: '', role: 'student' });
  const [showAddStudent, setShowAddStudent] = useState(false);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

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
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/students/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      setStudents((prev) => prev.filter((student) => student.username !== username));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const student = await response.json();
      setStudents((prev) => [...prev, student]);
      // Reset the newStudent state with default values
      setNewStudent({ username: '', score: 0, password: '', role: 'student' });
      setShowAddStudent(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div className="view-students-container">
      <h2 className="view-students-title">Students</h2>
      <table className="students-table">
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
                <button className="delete-button" onClick={() => handleDelete(student.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="toggle-add-student-button" onClick={() => setShowAddStudent(!showAddStudent)}>
        {showAddStudent ? 'Cancel' : 'Add New Student'}
      </button>
      {showAddStudent && (
        <div className="add-student-form">
          <h3 className="add-student-title">Add Student</h3>
          <input
            className="student-input"
            type="text"
            value={newStudent.username}
            onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
            placeholder="Username"
          />
          <input
            className="student-input"
            type="number"
            value={newStudent.score}
            onChange={(e) => setNewStudent({ ...newStudent, score: parseInt(e.target.value, 10) || 0 })}
            placeholder="Score"
          />
          <input
            className="student-input"
            type="password"
            value={newStudent.password}
            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
            placeholder="Password"
          />
          <select
            className="student-input"
            value={newStudent.role}
            onChange={(e) => setNewStudent({ ...newStudent, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <button className="add-student-button" onClick={handleAddStudent}>Add</button>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
