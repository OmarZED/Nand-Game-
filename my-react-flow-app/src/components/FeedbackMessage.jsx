import React from 'react';

const FeedbackMessage = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: feedback.success ? '#d0f8ce' : '#ffcccb',
        padding: '1rem',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 20,
        maxWidth: '300px',
      }}
    >
      {feedback.message}
    </div>
  );
};

export default FeedbackMessage; 