import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../db/postsDb';
import '../styles/BoardPage.css';

function BoardPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await getAllPosts();
      setPosts(result.reverse());
    };
    load();
  }, []);

  return (
    <div className="boardpage-container">
      <h2>게시판</h2>
      <Link to="/board/write">
        <button>글쓰기</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>도서명</th> {/* ✅ 도서명 컬럼 추가 */}
            <th>글쓴이</th>
            <th>작성시간</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id}>
              <td>{posts.length - index}</td>
              <td>
                <Link to={`/board/${post.id}`}>{post.title}</Link>
              </td>
              <td>{post.bookName || '-'}</td> {/* ✅ 도서명 표시 */}
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleString()}</td>
              <td>{post.likes || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoardPage;
