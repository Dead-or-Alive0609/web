import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyBookListPage.css"; // ✅ CSS 분리 적용

function MyBookListPage() {
  const [activeTab, setActiveTab] = useState("reserved");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    setLoading(true);
    const loadBooks = () => {
      try {
        const key =
          activeTab === "reserved"
            ? `reservedBooks_${username}`
            : `likedBooks_${username}`;
        const data = JSON.parse(localStorage.getItem(key)) || [];
        setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("로딩 실패:", e);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadBooks();
    }
  }, [activeTab, username]);

  const handleCancel = (isbn) => {
    const key =
      activeTab === "reserved"
        ? `reservedBooks_${username}`
        : `likedBooks_${username}`;
    const list = JSON.parse(localStorage.getItem(key)) || [];
    const updated = list.filter((b) => b.isbn !== isbn);
    localStorage.setItem(key, JSON.stringify(updated));
    setBooks(updated);

    if (activeTab === "reserved") {
      const stockMap = JSON.parse(localStorage.getItem("bookStocks")) || {};
      const current = stockMap[isbn] ?? 5;
      stockMap[isbn] = current + 1;
      localStorage.setItem("bookStocks", JSON.stringify(stockMap));
    }
  };

  const handleClick = (isbn) => {
    navigate(`/detail/${isbn}`);
  };

  return (
    <div className="my-book-page">
      <h2>📂 내 도서 리스트</h2>

      <div className="book-tab-buttons">
        <button
          onClick={() => setActiveTab("reserved")}
          className={activeTab === "reserved" ? "active" : ""}
        >
          📖 예매 목록
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={activeTab === "liked" ? "active" : ""}
        >
          💖 찜 목록
        </button>
      </div>

      {loading ? (
        <p>📡 불러오는 중입니다...</p>
      ) : books.length === 0 ? (
        <p>📭 저장된 도서가 없습니다.</p>
      ) : (
        <div className="book-list-grid">
          {books.map((book, index) => (
            <div
              key={book.isbn || index}
              className="book-card"
              onClick={() => handleClick(book.isbn)}
            >
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className="no-img">이미지 없음</div>
              )}
              <div className="book-info">
                <h4>{book.title || "제목 없음"}</h4>
                <p>{Array.isArray(book.authors) ? book.authors.join(", ") : "저자 없음"}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel(book.isbn);
                }}
              >
                {activeTab === "reserved" ? "반납" : "찜 취소"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookListPage;
