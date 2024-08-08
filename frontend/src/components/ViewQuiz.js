import React, { useEffect, useState } from 'react';

const ViewQuiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
    
        const response = await fetch('http://localhost:5000/api/quiz', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    };

    fetchQuiz();
  }, []);

  const deleteQuestion = async (id) => {
    try {
      const token = localStorage.getItem('token');
    
      const response = await fetch(`http://localhost:5000/api/quiz/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      if (!response.ok) throw new Error('Network response was not ok');
      setQuiz(quiz.filter(question => question.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
    
      const response = await fetch('http://localhost:5000/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestion),
      });
    
      if (!response.ok) throw new Error('Network response was not ok');
      const question = await response.json();
      setQuiz((prev) => [...prev, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        answer: '',
      });
      setShowAddQuestion(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="view-quiz-container">
      <header className="view-quiz-header">
        <h2 className="page-title">View Quiz</h2>
      </header>
      <button className="add-question-button my-4" onClick={() => setShowAddQuestion(!showAddQuestion)}>
        {showAddQuestion ? 'Cancel' : 'Add New Question'}
      </button>
      {showAddQuestion && (
        <div className="add-question-form">
          <h3>Add Question</h3>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Question"
            className="input-field"
          />
          {newQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...newQuestion.options];
                newOptions[index] = e.target.value;
                setNewQuestion({ ...newQuestion, options: newOptions });
              }}
              placeholder={`Option ${index + 1}`}
              className="input-field"
            />
          ))}
          <input
            type="text"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            placeholder="Answer"
            className="input-field"
          />
          <button className="add-button" onClick={handleAddQuestion}>Add</button>
        </div>
      )}
      <table className="quiz-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Question</th>
            <th>Options</th>
            <th>Answer</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {quiz.map((question,index) => (
            <tr key={question.id}> 
            <td>{index + 1}</td>
              <td>{question.question}</td>
              <td>
                <div className="options-grid">
                  {(question.options || []).map((option, index) => (
                    <div key={index} className="option-item">
                      {option}
                    </div>
                  ))}
                </div>
              </td>
              <td>{question.answer}</td>
              <td>
                <button className="delete-button" onClick={() => deleteQuestion(question.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewQuiz;
