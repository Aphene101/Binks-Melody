import "./login.js";
import { auth, createPlaylist, db } from "./firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js loaded");

  const guestButton = document.querySelector(".guest");
  const sidebar = document.querySelector(".sidebar");
  const newPlaylistBtn = document.getElementById("newPlaylistBtn");
  const popup = document.querySelector(".add-playlist");
  const overlay = document.createElement("div");
  const createBtn = document.getElementById("createPlaylistBtn");
  const nameInput = document.getElementById("playlistNameInput");

  overlay.className = "overlay";
  document.body.appendChild(overlay);

  guestButton?.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("active");
    document.body.style.overflow = sidebar.classList.contains("show")
      ? "hidden"
      : "auto";
  });

  overlay.addEventListener("click", function () {
    const isSidebarOpen = sidebar?.classList.contains("show");
    const isPopupOpen = popup?.classList.contains("show");

    if (isSidebarOpen) sidebar.classList.remove("show");
    if (isPopupOpen) popup.classList.remove("show");

    if (isSidebarOpen || isPopupOpen) {
      overlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  newPlaylistBtn?.addEventListener("click", () => {
    popup.classList.add("show");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  sidebar?.addEventListener("click", (e) => e.stopPropagation());
  popup?.addEventListener("click", (e) => e.stopPropagation());

  createBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    const userId = auth.currentUser?.uid;
    console.log("auth.currentUser:", auth?.currentUser);
    if (!userId) {
      alert("You need to be logged in to create a playlist.");
      return;
    }

    await createPlaylist(userId, name);
    popup.classList.remove("show");
    nameInput.value = "";

    location.reload();
  });
});

const usernameDisplay = document.querySelector(".guest p");

onAuthStateChanged(auth, async (user) => {
  usernameDisplay.textContent = "Guest";

  if (user) {
    try {
      const q = query(
        collection(db, "usernames"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usernameDoc = querySnapshot.docs[0];
        const username = usernameDoc.id;

        usernameDisplay.textContent = username;
      } else {
        console.warn("No username found for user UID:", user.uid);
        usernameDisplay.textContent = "Guest";
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      usernameDisplay.textContent = "Guest";
    }
  } else {
    usernameDisplay.textContent = "Guest";
    console.log("No user is logged in.");
  }
});

document.querySelector(".logout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    document.querySelector(".guest p").textContent = "Guest";
  } catch (error) {
    console.error("Error signing out:", error);
  }
});
