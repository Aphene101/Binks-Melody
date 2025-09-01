import { auth } from "./firebase.js";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

const statusEl = document.getElementById("reset-status");
const form = document.getElementById("reset-form");
const newPwInput = document.getElementById("new-password");

function qp(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const mode = qp("mode");
const oobCode = qp("oobCode");

async function init() {
  if (mode !== "resetPassword" || !oobCode) {
    statusEl.textContent = "Invalid or malformed reset link.";
    form.style.display = "none";
    return;
  }

  try {
    const email = await verifyPasswordResetCode(auth, oobCode);
    statusEl.textContent = `Resetting password for ${email}`;
    statusEl.classList.remove("error-message");
  } catch (err) {
    console.error(err);
    statusEl.textContent = "This reset link is invalid or expired.";
    form.style.display = "none";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = newPwInput.value.trim();
  if (!newPassword) return;

  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    statusEl.textContent = "Password updated! Redirecting to login...";
    statusEl.classList.remove("error-message");
    setTimeout(() => {
      window.location.href = import.meta.env.BASE_URL + "index.html";
    }, 900);
  } catch (err) {
    console.error(err);
    statusEl.textContent =
      "Could not update password. Request a new reset email.";
  }
});

init();
