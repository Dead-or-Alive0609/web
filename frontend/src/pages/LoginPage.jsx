import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../db/indexedDb';
import '../styles/Login.css';

function LoginPage({ setUsername }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await getUserByEmail(form.email);
    if (!user) {
      alert('등록되지 않은 이메일입니다.');
      return;
    }

    if (user.password !== form.password) {
      alert('비밀번호가 틀렸습니다.');
      return;
    }

    localStorage.setItem('username', user.name);
    setUsername(user.name); // ✅ App 상태 업데이트
    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <br />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>계정이 없으신가요? <a href="/signup">회원가입</a></p>
    </div>
  );
}

export default LoginPage;
