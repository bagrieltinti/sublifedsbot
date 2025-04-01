const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function saveUserData(userId, data) {
  const userRef = ref(db, `users/${userId}`);
  await set(userRef, data);
}

async function getUserData(userId) {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `users/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
}

module.exports = {
  saveUserData,
  getUserData
};
