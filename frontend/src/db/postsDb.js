import { openDB } from 'idb';

const DB_NAME = 'postsDB';
const DB_VERSION = 6; // 🔥 버전 확실히 높이기
const POST_STORE = 'posts';
const COMMENT_STORE = 'comments';

export async function initDB() {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        console.log("🔥 upgrading DB...");
        if (!db.objectStoreNames.contains(POST_STORE)) {
          const postStore = db.createObjectStore(POST_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          postStore.createIndex('createdAt', 'createdAt');
          console.log("✅ POST_STORE created");
        }

        if (!db.objectStoreNames.contains(COMMENT_STORE)) {
          const commentStore = db.createObjectStore(COMMENT_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          commentStore.createIndex('postId', 'postId');
          console.log("✅ COMMENT_STORE created");
        }
      },
    });

    console.log("✅ DB opened successfully");
    return db;
  } catch (err) {
    console.error("❌ DB init failed:", err);
    throw err;
  }
}

// POSTS
export async function addPost(post) {
  const db = await initDB();
  return db.add(POST_STORE, post);
}

export async function getAllPosts() {
  const db = await initDB();
  return db.getAllFromIndex(POST_STORE, 'createdAt');
}

export async function getPost(id) {
  const db = await initDB();
  return db.get(POST_STORE, Number(id));
}

export async function updatePost(post) {
  const db = await initDB();
  return db.put(POST_STORE, post);
}

export async function deletePost(id) {
  const db = await initDB();
  return db.delete(POST_STORE, Number(id));
}

// COMMENTS
export async function addComment(comment) {
  const db = await initDB();
  return db.add(COMMENT_STORE, comment);
}

export async function getCommentsByPostId(postId) {
  const db = await initDB();
  const tx = db.transaction(COMMENT_STORE);
  const index = tx.store.index('postId');
  return index.getAll(Number(postId));
}
