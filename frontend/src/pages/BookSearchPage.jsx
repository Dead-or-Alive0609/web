import React, { useState } from "react";
import { searchBooks } from "../api/bookApi";
import "../styles/BookSearchPage.css";

function BookSearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === "") return;
    const result = await searchBooks(query);
    setBooks(result);
  };

  return (
    <div className="book-search-page">
      <h2>📚 도서 검색</h2>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 제목 또는 저자 입력"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <div className="search-results">
        {books.length > 0 ? (
          books.map((book) => {
            const isbn13 = book.isbn?.split(" ").find((num) => num.length === 13) || "";
            return (
              <div
                key={isbn13}
                className="search-book-card"
                onClick={() => window.location.href = `/detail/${isbn13}`}
              >
                {book.thumbnail ? (
                  <img className="search-book-img" src={book.thumbnail} alt={book.title} />
                ) : (
                  <div className="no-img">이미지 없음</div>
                )}
                <div className="search-book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.authors?.join(", ")}</div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default BookSearchPage;
