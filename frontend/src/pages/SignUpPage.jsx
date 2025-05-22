import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, getUserByEmail } from '../db/indexedDb';
import '../styles/Login.css';

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!form.name || !form.email || !form.password) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 중복 이메일 확인
    const existing = await getUserByEmail(form.email);
    if (existing) {
      alert('이미 등록된 이메일입니다.');
      return;
    }

    try {
      await addUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error('[회원가입 에러]', error);
    }
  };

  return (
    <div className="login-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        <br />
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <br />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignUpPage;
