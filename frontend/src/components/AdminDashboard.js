import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/view-results')}>View Student Results</button>
      <button onClick={() => navigate('/add-question')}>Add Quiz Questions</button>
    </div>
  );
};
export default AdminDashboard;
