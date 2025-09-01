import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

const app = getApp();
const db = getFirestore(app);

function getFriendlyErrorMessage(error) {
  const code = error.code || error.message;

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email or username.";
    case "auth/invalid-credential":
      return "Email / Password is incorrect.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-not-verified":
      return "Please verify your email before logging in.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

async function resolveToEmail(inputValue) {
  if (inputValue.includes("@")) {
    return inputValue;
  }

  const docRef = doc(db, "usernames", inputValue);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data().email;
  } else {
    throw new Error("Username not found");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginInput = document.querySelector("#login-email");
  const passwordInput = document.querySelector("#login-password");
  const loginButton = document.querySelector("#login-button");
  const errorBox = document.querySelector("#login-error");
  const forgotLink = document.getElementById("forgot-password");

  if (!loginInput || !passwordInput || !loginButton || !errorBox) return;

  loginButton.addEventListener("click", async () => {
    const inputVal = loginInput.value.trim();
    const password = passwordInput.value;

    if (!inputVal || !password) {
      errorBox.textContent = "Please enter both fields.";
      return;
    }

    try {
      const email = await resolveToEmail(inputVal);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        throw { code: "auth/email-not-verified" };
      }

      errorBox.textContent = "";

      window.location.href = "./home.html";
    } catch (err) {
      console.error("Login error:", err);
      const friendly = getFriendlyErrorMessage(err);
      errorBox.textContent = friendly;
    }
  });

  forgotLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      let typed = loginInput?.value?.trim();

      if (!typed) {
        typed = window
          .prompt("Enter the email (or username) for your account:")
          ?.trim();
      }
      if (!typed) return;

      let email = typed;
      if (!typed.includes("@")) {
        try {
          email = await resolveToEmail(typed);
        } catch {}
      }

      const resetUrl = new URL(
        import.meta.env.BASE_URL + "reset.html",
        window.location.origin
      ).toString();
      const actionCodeSettings = { url: resetUrl, handleCodeInApp: false };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      alert("If that account exists, a reset link has been sent.");
    } catch (err) {
      console.error(err);
      alert("If that account exists, a reset link has been sent.");
    }
  });
});
