import { openDB } from 'idb';

const DB_NAME = 'vectaDB';
const DB_VERSION = 7; // 🔺버전 반드시 올리기!
const POST_STORE = 'posts';
const COMMENT_STORE = 'comments';
const USER_STORE = 'users';

export async function initDB() {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        console.log("🔥 upgrading vectaDB...");

        if (!db.objectStoreNames.contains(POST_STORE)) {
          const postStore = db.createObjectStore(POST_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          postStore.createIndex('createdAt', 'createdAt');
        }

        if (!db.objectStoreNames.contains(COMMENT_STORE)) {
          const commentStore = db.createObjectStore(COMMENT_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          commentStore.createIndex('postId', 'postId');
        }

        if (!db.objectStoreNames.contains(USER_STORE)) {
          db.createObjectStore(USER_STORE, { keyPath: 'email' });
        }

        console.log("✅ All stores ensured.");
      },
    });

    return db;
  } catch (err) {
    console.error("❌ DB init failed:", err);
    throw err;
  }
}
