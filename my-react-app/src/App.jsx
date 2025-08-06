import React, { useState } from 'react';
function App() {

  const [data, setData] = useState([{
    name: 'John Doe',
    age: 30,
    email: 'John@gmail.com'
  }, {
    name: 'Samson',
    age: 32,
    email: 'Samson@gmail.com'
  }]);

  const updateData = () => {
    const newData = {
      name: 'Jane Doe',
      age: 28,
      email: ''
    }
    const updatedData = [...data, newData];
    setData(updatedData);
    console.log('Updated Data:', updatedData);
  }

  const handleClick = () => {
    updateData();
    const updatedUsers = data.filter(user => user.age === 28);
    console.log('Filtered Users:', updatedUsers);
  }

  return (
    <div>
      <h1>Mock POST API Demo</h1>
      <p>Check the console for POST request results.</p>
      <button onClick={handleClick}>ClickMe</button>
      {data.map((user, index) => (
        <div key={index}>
          <h2>{user.name}</h2>
          <p>Age: {user.age}</p>
          <p>Email: {user.email}</p>
        </div>)
      )
      }
    </div>
  );
}

export default App;
