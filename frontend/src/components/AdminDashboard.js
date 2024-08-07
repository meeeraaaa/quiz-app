import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* <button onClick={() => navigate('/view-results')}>View Students</button>
      <button onClick={() => navigate('/add-question')}>Add Quiz Questions</button> */}
      <button onClick={() => navigate('/view-students')}>View Students</button>
      <button onClick={() => navigate('/view-quiz')}>View Quiz</button>
    </div>
  );
};
export default AdminDashboard;
//now i want that that the admin dashboard should have 2 buttons:view students and view quiz. each should lead to a page with a table. the view students table should have the following columns name of the student, their result, and delete button to delete that student from the database. and a button at the buttom of the page to add a new student.
// and in the view quiz page table the following columns: question, the options and the answer of them. in this also , i want the delete question fucntinality and an add question on the top right corner of the table