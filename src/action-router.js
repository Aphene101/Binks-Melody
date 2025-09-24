import { firebaseProjectId } from "./firebase.js";

const params = new URLSearchParams(location.search);
const mode = params.get("mode");
const oob = params.get("oobCode");
const apiKey = params.get("apiKey");

const base = import.meta.env.BASE_URL || "/";

function go(to) {
  location.replace(to);
}

if (!mode || !oob || !apiKey) {
  go(base + "index.html");
} else if (mode === "resetPassword") {
  go(base + "reset.html?" + params.toString());
} else if (mode === "verifyEmail") {
  const hosted =
    `https://${firebaseProjectId}.firebaseapp.com/__/auth/action?` +
    params.toString();
  go(hosted);
} else {
  go(base + "index.html");
}
