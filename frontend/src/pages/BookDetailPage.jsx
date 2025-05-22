import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetailPage() {
  const { isbn: rawIsbn } = useParams();
  const isbn13 = rawIsbn?.split(" ").find((s) => s.length === 13) || rawIsbn;
  const [book, setBook] = useState(null);
  const [stock, setStock] = useState(5);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/search?keyword=${isbn13}`);
        if (!res.ok) throw new Error("검색 API 실패");
        const results = await res.json();
        const found = results.find((item) => item.isbn?.includes(isbn13)) || results[0];

        if (found) {
          setBook({ ...found, isbn: isbn13 });
          const currentStock = getStoredStock(isbn13);
          setStock(currentStock);
        }
      } catch (err) {
        console.error("도서 검색 실패:", err);
      }
    };

    fetchBook();
  }, [isbn13]);

  const getStoredStock = (isbn) => {
    const stocks = JSON.parse(localStorage.getItem("bookStocks")) || {};
    return stocks[isbn] ?? 5;
  };

  const updateStock = (isbn, newStock) => {
    const stocks = JSON.parse(localStorage.getItem("bookStocks")) || {};
    stocks[isbn] = newStock;
    localStorage.setItem("bookStocks", JSON.stringify(stocks));
  };

  const handleReserve = () => {
    if (!book || !username) return;
    if (stock <= 0) {
      alert("재고가 없습니다.");
      return;
    }

    const key = `reservedBooks_${username}`;
    const reserved = JSON.parse(localStorage.getItem(key)) || [];
    const exists = reserved.some((b) => b.isbn === isbn13);
    if (exists) {
      alert("이미 예매한 도서입니다.");
      return;
    }

    reserved.push(book);
    localStorage.setItem(key, JSON.stringify(reserved));
    updateStock(isbn13, stock - 1);
    setStock((prev) => prev - 1);
    alert("도서가 예매되었습니다.");
  };

  const handleLike = () => {
    if (!book || !username) return;
    const key = `likedBooks_${username}`;
    const liked = JSON.parse(localStorage.getItem(key)) || [];
    const exists = liked.some((b) => b.isbn === isbn13);
    if (exists) {
      alert("이미 찜한 도서입니다.");
      return;
    }

    liked.push(book);
    localStorage.setItem(key, JSON.stringify(liked));
    alert("찜 목록에 추가되었습니다.");
  };

  if (!book)
    return <div style={{ padding: "20px" }}>도서 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: "20px", display: "flex" }}>
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          style={{ width: "200px", height: "auto", marginRight: "24px" }}
        />
      )}
      <div>
        <h2>{book.title}</h2>
        <p><strong>저자:</strong> {book.authors?.join(", ")}</p>
        <p><strong>출판사:</strong> {book.publisher}</p>
        <p><strong>출간일:</strong> {book.datetime?.split("T")[0]}</p>
        <p><strong>ISBN:</strong> {isbn13}</p>
        <p><strong>설명:</strong> {book.contents?.slice(0, 300)}...</p>
        <p><strong>📦 현재 재고:</strong> {stock}권</p>
        <button onClick={handleReserve} style={{ marginRight: "10px" }}>
          📖 도서 예매
        </button>
        <button onClick={handleLike}>💖 찜</button>
      </div>
    </div>
  );
}

export default BookDetailPage;
