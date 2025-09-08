/**
 * @file firebase.js
 * @description Firebase initialization and playlist helper utilities.
 * Provides configured Auth and Firestore instances,
 * and functions for creating starter and custom playlists.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPEZCaoUiyeHZI9uOu2Aq_8uaH_x09MtE",
  authDomain: "binks-melody.firebaseapp.com",
  projectId: "binks-melody",
  storageBucket: "binks-melody.firebasestorage.app",
  messagingSenderId: "493118106781",
  appId: "1:493118106781:web:4fd0998f762a3923a97874",
  measurementId: "G-497SCW2NVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 * @type {import("firebase/auth").Auth}
 */
const auth = getAuth(app);

/**
 * Firestore database instance.
 * @type {import("firebase/firestore").Firestore}
 */
const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set");
  })
  .catch((err) => {
    console.error("Persistence error:", err);
  });

export { auth, db };

/**
 * Creates a starter playlist for a newly registered user.
 * @async
 * @function createStarterPlaylist
 * @param {string} userId - The UID of the Firebase Auth user.
 * @returns {Promise<void>} Resolves when the playlist is created.
 */
export async function createStarterPlaylist(userId) {
  const ref = doc(collection(db, "users", userId, "playlists"));

  await setDoc(ref, {
    name: "My First Playlist",
    songs: [],
  });
}

/**
 * Creates a new custom playlist for a user.
 * @async
 * @function createPlaylist
 * @param {string} userId - The UID of the Firebase Auth user.
 * @param {string} playlistName - The name of the playlist.
 * @returns {Promise<void>} Resolves when the playlist is created.
 */
export async function createPlaylist(userId, playlistName) {
  const playlistRef = doc(collection(db, "users", userId, "playlists"));

  try {
    await setDoc(playlistRef, {
      name: playlistName,
      songs: [],
    });

    console.log("Playlist created:", playlistName);
  } catch (error) {
    console.error("Error creating playlist:", error);
  }
}
