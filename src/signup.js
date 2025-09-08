/**
 * @file signup.js
 * @description Handles user registration. Includes:
 *  - Creating a Firebase Auth account
 *  - Ensuring unique usernames
 *  - Storing user and username mappings in Firestore
 *  - Sending email verification
 *  - Creating a starter playlist
 *  - Logging out after signup until verification is complete
 */

import { auth, db, createStarterPlaylist } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sign-up-form");
  const usernameInput = document.getElementById("sign-up-username");
  const emailInput = document.getElementById("sign-up-email");
  const passwordInput = document.getElementById("sign-up-password");
  const errorBox = document.getElementById("sign-up-error");

  /**
   * Handle the sign-up form submission.
   *
   * @async
   * @param {SubmitEvent} e - Form submit event
   * @returns {Promise<void>}
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !email || !password) {
      errorBox.textContent = "All fields are required.";
      return;
    }

    // Check Firestore to ensure username is not taken
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      errorBox.textContent = "Username is already taken.";
      return;
    }

    let userCredential;
    try {
      // Create the Firebase Auth account
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      // Map username → email in Firestore
      await setDoc(doc(db, "usernames", username), {
        email: email,
        userId: userId,
      });

      // Create a user document
      await setDoc(doc(db, "users", userId), {});

      // Send email verification
      await sendEmailVerification(user);

      // Create a starter playlist
      await createStarterPlaylist(userId);

      // Log out the user until email verification is complete
      await signOut(auth);
      alert("Account created! Please verify your email before logging in.");

      window.location.href = "./index.html";
    } catch (err) {
      console.error("Signup error:", err);

      // Cleanup partially created user account if signup fails
      if (userCredential && userCredential.user) {
        try {
          await deleteUser(userCredential.user);
          console.log("Deleted partially registered user due to error.");
        } catch (cleanupErr) {
          console.warn(
            "Could not delete user after failed signup:",
            cleanupErr
          );
        }
      }

      // Display friendly error message
      if (err.code === "auth/email-already-in-use") {
        errorBox.textContent = "This email is already registered.";
      } else {
        errorBox.textContent = err.message || "Signup failed.";
      }
    }
  });
});
