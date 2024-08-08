import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // Correct import

import '../App.css';  // Importing your CSS for styling

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', credentials.username);

        // Decode the token to get role
        const decoded = jwtDecode(result.token);  // Correct usage of jwt-decode
        localStorage.setItem('role', decoded.role);

        // Redirect based on role
        if (decoded.role === 'student') {
          navigate('/student-dashboard');
        } else if (decoded.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          alert('Unknown role');
        }
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
