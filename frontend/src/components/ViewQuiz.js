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
        const response = await fetch('http://localhost:5000/api/quiz');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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
      const response = await fetch(`http://localhost:5000/api/quiz/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setQuiz(quiz.filter(question => question.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const question = await response.json();
      setQuiz((prev) => [...prev, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        answer: ''
      });
      setShowAddQuestion(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div>
      <h2>View Quiz</h2>
      <button onClick={() => setShowAddQuestion(!showAddQuestion)}>
        {showAddQuestion ? 'Cancel' : 'Add New Question'}
      </button>
      {showAddQuestion && (
        <div>
          <h3>Add Question</h3>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Question"
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
            />
          ))}
          <input
            type="text"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            placeholder="Answer"
          />
          <button onClick={handleAddQuestion}>Add</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Options</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quiz.map((question) => (
            <tr key={question.id}>
              <td>{question.question}</td>
              {/* <td>{question.options.join(', ')}</td> */}
              <ul>
    {(question.options || []).map((option, index) => (
      <li key={index}>{option}</li>
    ))}
  </ul>
              <td>{question.answer}</td>
              <td>
                <button onClick={() => deleteQuestion(question.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ViewQuiz;
