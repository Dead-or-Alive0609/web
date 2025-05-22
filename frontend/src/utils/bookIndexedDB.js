const DB_NAME = "BookAppDB";
const DB_VERSION = 6;

const STORE_NAMES = {
  reserved: "reservedBooks",
  liked: "likedBooks",
  stock: "bookStocks",
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAMES.reserved)) {
        db.createObjectStore(STORE_NAMES.reserved, { keyPath: "isbn" });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.liked)) {
        db.createObjectStore(STORE_NAMES.liked, { keyPath: "isbn" });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.stock)) {
        db.createObjectStore(STORE_NAMES.stock, { keyPath: "isbn" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function extractIsbn(isbnStr) {
  return isbnStr?.split(" ").find((s) => s.length === 13) || isbnStr;
}

export async function reserveBook(book, rawIsbn) {
  const db = await openDB();
  const isbn = extractIsbn(rawIsbn);
  const tx = db.transaction(["reservedBooks", "bookStocks"], "readwrite");
  const reservedStore = tx.objectStore("reservedBooks");
  const stockStore = tx.objectStore("bookStocks");

  const stockResult = await stockStore.get(isbn);
  const currentStock = stockResult?.stock ?? 5;

  await reservedStore.put({ ...book, isbn });
  await stockStore.put({ isbn, stock: Math.max(0, currentStock - 1) });

  return tx.complete;
}

export async function likeBook(book) {
  const db = await openDB();
  const isbn = extractIsbn(book.isbn);
  const tx = db.transaction("likedBooks", "readwrite");
  const store = tx.objectStore("likedBooks");

  await store.put({ ...book, isbn });
  return tx.complete;
}

export async function getReservedBooks() {
  const db = await openDB();
  const tx = db.transaction("reservedBooks", "readonly");
  const store = tx.objectStore("reservedBooks");
  const result = await store.getAll();
  return result || [];
}

export async function getLikedBooks() {
  const db = await openDB();
  const tx = db.transaction("likedBooks", "readonly");
  const store = tx.objectStore("likedBooks");
  const result = await store.getAll();
  return result || [];
}

export async function cancelReservation(rawIsbn) {
  const db = await openDB();
  const isbn = extractIsbn(rawIsbn);
  const tx = db.transaction(["reservedBooks", "bookStocks"], "readwrite");
  const reservedStore = tx.objectStore("reservedBooks");
  const stockStore = tx.objectStore("bookStocks");

  await reservedStore.delete(isbn);
  const stockResult = await stockStore.get(isbn);
  const currentStock = stockResult?.stock ?? 5;
  await stockStore.put({ isbn, stock: currentStock + 1 });

  return tx.complete;
}

export async function cancelLike(rawIsbn) {
  const db = await openDB();
  const isbn = extractIsbn(rawIsbn);
  const tx = db.transaction("likedBooks", "readwrite");
  const store = tx.objectStore("likedBooks");
  await store.delete(isbn);
  return tx.complete;
}

export async function getStockForBook(rawIsbn) {
  const db = await openDB();
  const isbn = extractIsbn(rawIsbn);
  const tx = db.transaction("bookStocks", "readonly");
  const store = tx.objectStore("bookStocks");
  const result = await store.get(isbn);
  return result?.stock ?? 5;
}
