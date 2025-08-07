import { auth, db, createStarterPlaylist } from './firebase.js';
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      errorBox.textContent = "Username is already taken.";
      return;
    }

    let userCredential;
    try {

      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      await setDoc(doc(db, "usernames", username), {
        email: email,
        userId: userId
      });

      await setDoc(doc(db, "users", userId), {});

      await sendEmailVerification(user);

      await createStarterPlaylist(userId);

      await signOut(auth);
      alert("Account created! Please verify your email before logging in.");

      window.location.href = "./index.html";

    } catch (err) {
      console.error("Signup error:", err);

      if (userCredential && userCredential.user) {
        try {
          await deleteUser(userCredential.user);
          console.log("Deleted partially registered user due to error.");
        } catch (cleanupErr) {
          console.warn("Could not delete user after failed signup:", cleanupErr);
        }
      }

      if (err.code === "auth/email-already-in-use") {
        errorBox.textContent = "This email is already registered.";
      } else {
        errorBox.textContent = err.message || "Signup failed.";
      }
    }
  });
});
