import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #222;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Menu = styled.div`
  a {
    color: #fff;
    margin: 0 1rem;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    background: transparent;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-left: 1rem;
    font-size: 1rem;
  }

  button:hover {
    text-decoration: underline;
  }
`;

const Logo = styled.div`
  color: #fff;
  font-weight: bold;
  cursor: default;
`;

function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Nav>
      <Logo onClick={() => navigate('/')}>vecta</Logo>
      <Menu>
        <Link to="/board">게시판</Link>
        <Link to="/search">도서 검색</Link>
        <Link to="/recommend">도서 추천</Link>
        <Link to="/mylist">내 도서 리스트</Link>
        {username && (
          <button onClick={handleLogout}>로그아웃</button>
        )}
      </Menu>
      {username && (
        <div style={{ color: '#fff' }}>
          안녕하세요, {username}님. vecta에 오신 것을 환영합니다.
        </div>
      )}
    </Nav>
  );
}

export default Navbar;
