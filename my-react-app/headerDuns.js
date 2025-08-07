import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
`;

const Title = styled.h3`
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const DunsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DunsForm = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  gap: 6px;
  position: absolute;
  top: 40px;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const DunsInput = styled.input`
  margin-bottom: 6px;
`;

// Functional Component
const DunsGenerator = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = (e) => {
    e.preventDefault();
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
  };

  const submitDuns = () => {
    alert('DUNS submitted!');
    cancelForm();
  };

  return (
    <Header>
      <Title>This is Header content</Title>
      <RightSection>
        <a href="#">Reset Duns</a>
        <input type="search" />
        <DunsContainer>
          <a href="#" onClick={toggleForm}>Generate Duns for employee</a>
          <span>This is for Employees</span>
          <DunsForm show={showForm}>
            <DunsInput type="text" placeholder="Enter employee ID" />
            <button type="button" onClick={submitDuns}>Submit</button>
            <button type="button" onClick={cancelForm}>Cancel</button>
          </DunsForm>
        </DunsContainer>
      </RightSection>
    </Header>
  );
};

export default DunsGenerator;
