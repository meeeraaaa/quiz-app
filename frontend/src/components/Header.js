import React from 'react';

const Header = () => {
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h1>Quiz App</h1>
      <div>
        {username && <span style={{ marginRight: '1rem' }}>Hello, {username}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
