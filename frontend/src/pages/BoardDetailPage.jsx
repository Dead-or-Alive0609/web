import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPost,
  updatePost,
  deletePost,
  addComment,
  getCommentsByPostId,
} from '../db/postsDb';
import '../styles/BoardDetailPage.css';
import { FaHeart, FaPaperPlane } from 'react-icons/fa';

function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [isAnonymous, setIsAnonymous] = useState(true);
  const username = localStorage.getItem('username');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const foundPost = await getPost(id);
      setPost(foundPost);
      setEditForm({ title: foundPost.title, content: foundPost.content });
      setLikes(foundPost.likes || 0);

      const commentList = await getCommentsByPostId(id);
      setComments(commentList);
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    const updated = { ...post, likes: (post.likes || 0) + 1 };
    await updatePost(updated);
    setPost(updated);
    setLikes(updated.likes);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment({
      postId: Number(id),
      content: commentText,
      writer: isAnonymous ? '익명' : (username || '익명'),
      createdAt: new Date().toISOString(),
    });
    const updated = await getCommentsByPostId(id);
    setComments(updated);
    setCommentText('');
  };

  const handleEdit = async () => {
    if (username !== post.author) {
      alert('수정 권한이 없습니다.');
      return;
    }
    const updatedPost = {
      ...post,
      title: editForm.title,
      content: editForm.content,
    };
    await updatePost(updatedPost);
    navigate('/board');
  };

  const handleDelete = async () => {
    if (username !== post.author) {
      alert('삭제 권한이 없습니다.');
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deletePost(post.id);
      navigate('/board');
    }
  };

  if (!post) return <div className="board-container">Loading...</div>;

  return (
    <div className="board-container">
      {editMode ? (
        <>
          <h2>글 수정</h2>
          <input
            name="title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <textarea
            name="content"
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          />
          <div className="board-buttons">
            <button onClick={handleEdit}>수정 완료</button>
            <button onClick={() => setEditMode(false)}>취소</button>
          </div>
        </>
      ) : (
        <>
          <div className="post-header">
            <div className="post-writer">{post.author || '익명'}</div>
            <div className="post-date">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
          <div className="post-title">{post.title}</div>
          <div className="post-content">{post.content}</div>

          <div className="like-section-gray">
            <button className="like-button-gray" onClick={handleLike}>
              <FaHeart />
            </button>
            <span className="like-count-gray">{likes}</span>
          </div>

          {username === post.author && (
            <div className="board-buttons">
              <button onClick={() => setEditMode(true)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </>
      )}

      <div className="comment-section">
        <h3>{comments.length}개의 댓글</h3>
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-meta">
                <strong>{c.writer}</strong> · {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="comment-content">{c.content}</div>
            </li>
          ))}
        </ul>
        <div className="comment-input-wrapper">
          <textarea
            className="comment-input"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <FaPaperPlane className="send-icon" onClick={handleAddComment} />
        </div>
        <div className="anonymous-check">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">익명으로 작성</label>
        </div>
      </div>
    </div>
  );
}

export default BoardDetailPage;
