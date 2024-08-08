import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated and authorized
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          navigate('/login'); 
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login'); // Redirect if token is invalid
      }
    } else {
      navigate('/login'); // Redirect if no token
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <div className="loading">Loading...</div>; // Show loading or nothing while checking authentication
  }

  return (
    <div className="admin-dashboard">
      <header><h2 className="dashboard-title">Admin Dashboard</h2></header>
      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => navigate('/view-students')}>View Students</button>
        <button className="dashboard-button" onClick={() => navigate('/view-quiz')}>View Quiz</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
