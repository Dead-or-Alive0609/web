import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../db/postsDb';
import '../styles/WritePage.css';

function WritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', bookName: '' });
  const username = localStorage.getItem('username');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      ...form,
      author: username,
      createdAt: new Date().toISOString(),
    };
    await addPost(newPost);
    navigate('/board');
  };

  return (
    <div className="board-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="제목"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="bookName"
          placeholder="도서명"
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="content"
          placeholder="내용"
          onChange={handleChange}
          required
        ></textarea>
        <br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default WritePage;
