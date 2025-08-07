// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
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
  measurementId: "G-497SCW2NVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Session persistence set');
  })
  .catch((error) => {
    console.error('Failed to set persistence:', error);
  });

export { auth };
export const db = getFirestore(app);

export async function createStarterPlaylist(userId) {
  const ref = doc(collection(db, "users", userId, "playlists"));

  await setDoc(ref, {
    name: "My First Playlist",
    songs: []
  });
}

export async function createPlaylist(userId, playlistName) {
  const playlistRef = doc(collection(db, "users", userId, "playlists"));

  try {
    await setDoc(playlistRef, {
      name: playlistName,
      songs: []
    });

    console.log("Playlist created:", playlistName);
  } catch (error) {
    console.error("Error creating playlist:", error);
  }
}