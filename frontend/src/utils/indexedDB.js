const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('postsAndCommentsDB', 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('comments')) {
        db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject('Database error: ' + e.target.error);
  });
};

// 게시글 추가
export const addPost = async (post) => {
  const db = await openDB();
  const transaction = db.transaction('posts', 'readwrite');
  const store = transaction.objectStore('posts');
  store.add(post);
};

// 댓글 추가
export const addComment = async (comment) => {
  const db = await openDB();
  const transaction = db.transaction('comments', 'readwrite');
  const store = transaction.objectStore('comments');
  store.add(comment);
};

// 게시글 불러오기
export const getPosts = async () => {
  const db = await openDB();
  const transaction = db.transaction('posts', 'readonly');
  const store = transaction.objectStore('posts');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject('Failed to get posts: ' + e.target.error);
  });
};

// 댓글 불러오기
export const getComments = async (postId) => {
  const db = await openDB();
  const transaction = db.transaction('comments', 'readonly');
  const store = transaction.objectStore('comments');
  const request = store.index('postId').getAll(postId); // 게시글 ID별로 댓글 가져오기

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject('Failed to get comments: ' + e.target.error);
  });
};
