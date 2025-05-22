import React from "react";
import { useNavigate } from "react-router-dom";

function BookCard({ book }) {
  const navigate = useNavigate();

  // ISBN 문자열에서 13자리 숫자만 추출
  const isbn13 = book.isbn?.split(" ").find((num) => num.length === 13) || "";

  const handleClick = () => {
    navigate(`/detail/${isbn13}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        display: "flex",
        cursor: "pointer",
        maxWidth: "600px"
      }}
    >
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          style={{ width: "100px", height: "auto", marginRight: "16px" }}
        />
      )}
      <div>
        <h3>{book.title}</h3>
        <p>저자: {book.authors?.join(", ") || "정보 없음"}</p>
        <p>출판사: {book.publisher}</p>
        <p>출간일: {book.datetime?.split("T")[0]}</p>
      </div>
    </div>
  );
}

export default BookCard;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/HomePage.css"; // 스타일 불러오기

// function BookCard({ book }) {
//   const navigate = useNavigate();

//   // ISBN 13자리만 추출
//   const isbn13 = book.isbn?.split(" ").find((num) => num.length === 13) || "";

//   const handleClick = () => {
//     navigate(`/detail/${isbn13}`);
//   };

//   return (
//     <div className="book-item" onClick={handleClick}>
//       {book.thumbnail ? (
//         <img className="book-img" src={book.thumbnail} alt={book.title} />
//       ) : (
//         <div className="no-img">이미지 없음</div>
//       )}
//       <div className="book-title">{book.title}</div>
//       <div className="book-author">{book.authors?.join(", ") || "정보 없음"}</div>
//     </div>
//   );
// }

// export default BookCard;
