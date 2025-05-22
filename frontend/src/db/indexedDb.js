import { openDB } from 'idb';

const DB_NAME = 'usersDB';
const DB_VERSION = 6; // ✅ 반드시 기존보다 높게 설정
const STORE_NAME = 'users';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'email' });
      }
    },
  });
}

export async function addUser(user) {
  const db = await initDB();
  await db.add(STORE_NAME, user);
}

export async function getUserByEmail(email) {
  const db = await initDB();
  return db.get(STORE_NAME, email);
}
