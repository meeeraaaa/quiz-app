import React, { useState } from 'react';

const AddQuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'question') {
      setQuestion(value);
    } else if (name.startsWith('option')) {
      const optionIndex = parseInt(name.replace('option', ''), 10);
      const newOptions = [...options];
      newOptions[optionIndex] = value;
      setOptions(newOptions);
    } else if (name === 'answer') {
      setAnswer(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          options,
          answer,
        }),
      });
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to add question');
      }
      const result = await response.json();
      console.log('Response body:', result);
      if (response.ok && result.success) {
        console.log(response +' ho toh raha hai yaar '+result.successMessage);
        setSuccessMessage('Question successfully added');
        setQuestion('');
        setOptions(['', '', '', '']);
        setAnswer('');
      } else {
        setSuccessMessage('Failed to add question');
        
      }
    } catch (error) {
      console.error('Error:', error.message);
      setSuccessMessage('Error: ' + error.message);
    }
  };// idont see any error in the 

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question</label>
          <input
            type="text"
            name="question"
            value={question}
            onChange={(e) => handleChange(e, -1)}
            required
          />
        </div>
        <div>
          <label>Option 1</label>
          <input
            type="text"
            name="option0"
            value={options[0]}
            onChange={(e) => handleChange(e, 0)}
            required
          />
        </div>
        <div>
          <label>Option 2</label>
          <input
            type="text"
            name="option1"
            value={options[1]}
            onChange={(e) => handleChange(e, 1)}
            required
          />
        </div>
        <div>
          <label>Option 3</label>
          <input
            type="text"
            name="option2"
            value={options[2]}
            onChange={(e) => handleChange(e, 2)}
            required
          />
        </div>
        <div>
          <label>Answer</label>
          <input
            type="text"
            name="answer"
            value={answer}
            onChange={(e) => handleChange(e, -1)}
            required
          />
        </div>
        <button type="submit">Add Question</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default AddQuestionForm;
