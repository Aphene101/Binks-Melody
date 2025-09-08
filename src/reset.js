/**
 * @file reset.js
 * Handles Firebase password reset flow:
 *  - Validates reset link from email
 *  - Updates user password
 *  - Redirects to login on success
 */

import { auth } from "./firebase.js";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

const statusEl = document.getElementById("reset-status");
const form = document.getElementById("reset-form");
const newPwInput = document.getElementById("new-password");

/**
 * Get query parameter value from current URL.
 * @param {string} name - Parameter name
 * @returns {string|null} The value or null if missing
 */
function qp(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const mode = qp("mode");
const oobCode = qp("oobCode");

/**
 * Initialize password reset screen by validating the reset link.
 * Displays the user’s email if valid, otherwise shows error.
 * @returns {Promise<void>}
 */
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

/**
 * Handle password reset form submit.
 * Confirms new password with Firebase and redirects to login on success.
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 */
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
