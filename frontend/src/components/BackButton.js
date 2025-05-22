import React from 'react';
import { useNavigate } from 'react-router-dom'; // react-router-dom의 useNavigate 사용

function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      이전으로 돌아가기
    </button>
  );
}

export default BackButton;
