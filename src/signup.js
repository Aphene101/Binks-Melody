import { auth, db, createStarterPlaylist } from './firebase.js';
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sign-up-form');
  const usernameInput = document.getElementById('sign-up-username');
  const emailInput = document.getElementById('sign-up-email');
  const passwordInput = document.getElementById('sign-up-password');
  const errorBox = document.getElementById('sign-up-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !email || !password) {
      errorBox.textContent = "All fields are required.";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      await sendEmailVerification(user);

      await setDoc(doc(db, "usernames", username), {
        email: email,
        userId: userId
      });

      await setDoc(doc(db, "users", userId), {});

      await createStarterPlaylist(userId);

      await signOut(auth);
      alert("Account created! Please verify your email before logging in.");

      window.location.href = "./index.html";

    } catch (err) {
      console.error("Signup error:", err);
      errorBox.textContent = err.message || "Signup failed.";
    }
  });
});
