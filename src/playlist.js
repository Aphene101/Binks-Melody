import { getTopTracksByTag } from "./jamendo.js";
import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

const FALLBACK_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAuMBgVdPxT8AAAAASUVORK5CYII=";

const params = new URLSearchParams(window.location.search);
const genre = params.get("genre");
let playlistId = params.get("id");
console.log("Playlist ID from URL:", playlistId);

if (!playlistId && !genre) {
  alert("No playlist selected. Redirecting to playlists page.");
  window.location.href = "./playlists.html";
}

const backBtn = document.getElementById("pl-back") || null;
const nameEl = document.getElementById("pl-name") || null;
const iconEl = document.getElementById("pl-icon") || null;
const songsWrap = document.getElementById("pl-songs") || null;

let currentUserId = null;
let currentTrack = null;

// Popup for song actions on the playlist page
const plSongPopup = document.createElement("div");
plSongPopup.className = "song-popup hidden";
plSongPopup.innerHTML = genre
  ? `
  <div class="popup-item" id="pl-addToPlaylistBtn">
    <img src="${import.meta.env.BASE_URL}Media/Purple-Add-Icon.svg" alt="Add">
    <span>Add to Playlist</span>
  </div>
`
  : `
  <div class="popup-item" id="pl-removeFromPlaylistBtn">
    <img src="${import.meta.env.BASE_URL}Media/Delete-Icon.svg" alt="Remove">
    <span>Remove from Playlist</span>
  </div>
`;
document.body.appendChild(plSongPopup);

function openMorePopup(anchorEl, track) {
  currentTrack = track;
  const rect = anchorEl.getBoundingClientRect();
  plSongPopup.style.top = `${rect.bottom + window.scrollY}px`;
  plSongPopup.style.left = `${rect.left + window.scrollX}px`;
  plSongPopup.classList.remove("hidden");
}

document.addEventListener("click", (e) => {
  if (!plSongPopup.contains(e.target)) {
    plSongPopup.classList.add("hidden");
  }
});

async function removeTrackFromPlaylist(uid, playlistId, track) {
  const playlistRef = doc(db, "users", uid, "playlists", playlistId);
  const snap = await getDoc(playlistRef);

  if (snap.exists() && Array.isArray(snap.data().songs)) {
    const arr = snap.data().songs || [];
    const filtered = arr.filter(
      (s) => (s.id ?? s.audio) !== (track.id ?? track.audio)
    );
    await updateDoc(playlistRef, { songs: filtered });
  } else {
    if (track.id) {
      const songDoc = doc(
        db,
        "users",
        uid,
        "playlists",
        playlistId,
        "songs",
        track.id
      );
      await deleteDoc(songDoc);
    } else {
      const songsCol = collection(
        db,
        "users",
        uid,
        "playlists",
        playlistId,
        "songs"
      );
      const songsSnap = await getDocs(songsCol);
      const match = songsSnap.docs.find(
        (d) => (d.data().id ?? d.data().audio) === (track.id ?? track.audio)
      );
      if (match) await deleteDoc(match.ref);
    }
  }
}

document
  .getElementById("pl-removeFromPlaylistBtn")
  ?.addEventListener("click", async () => {
    plSongPopup.classList.add("hidden");
    if (!currentUserId || !playlistId || !currentTrack) return;
    await removeTrackFromPlaylist(currentUserId, playlistId, currentTrack);
    const rows = [...document.querySelectorAll(".song-item")];
    const row = rows.find(
      (r) =>
        r.querySelector(".song-title")?.textContent ===
        (currentTrack.name || currentTrack.title)
    );
    row?.parentElement?.nextElementSibling?.remove?.();
    row?.parentElement?.remove?.();
  });

backBtn?.addEventListener("click", () => {
  if (genre) {
    window.location.href = "home.html";
  } else {
    window.location.href = "playlists.html";
  }
});

document
  .getElementById("pl-addToPlaylistBtn")
  ?.addEventListener("click", async () => {
    plSongPopup.classList.add("hidden");

    // hand the selected track to jamendo.js and reuse its chooser
    if (typeof window.__bmSetCurrentTrack === "function") {
      window.__bmSetCurrentTrack(currentTrack);
    }
    if (typeof window.__bmAddToPlaylist === "function") {
      window.__bmAddToPlaylist();
    } else {
      alert("Add-to-playlist is unavailable on this page.");
    }
  });

auth.onAuthStateChanged(async (user) => {
  if (user) currentUserId = user.uid;

  if (genre) {
    await loadGenrePlaylist(genre);
    return;
  }

  if (!playlistId) {
    console.warn("No playlist id found");
    return;
  }
  if (user) {
    currentUserId = user.uid;
    await loadPlaylist(user.uid, playlistId);
  }
});

async function loadPlaylist(uid, id) {
  console.log("Loading playlists");
  const ref = doc(db, "users", uid, "playlists", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  console.log(snap + "The snap is above");

  const data = snap.data();
  if (nameEl) nameEl.textContent = data.name || "Untitled Playlist";

  let songs = [];
  if (Array.isArray(data.songs) && data.songs.length) {
    songs = data.songs;
  } else {
    const songsCol = collection(db, "users", uid, "playlists", id, "songs");
    const songsSnap = await getDocs(songsCol);
    songs = songsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  const cover =
    songs[0]?.album_image || songs[0]?.albumArt || songs[0]?.cover || "";
  if (iconEl) {
    if (cover) {
      iconEl.style.backgroundImage = `url(${cover})`;
      iconEl.style.backgroundColor = "transparent";
      iconEl.style.backgroundSize = "cover";
      iconEl.style.backgroundPosition = "center";
    } else {
      iconEl.style.backgroundImage = "none";
    }
  }
  console.log(songs);
  renderSongs(songs);
}

async function loadGenrePlaylist(tag) {
  const pretty = tag.charAt(0).toUpperCase() + tag.slice(1);
  nameEl.textContent = pretty;

  const songs = await getTopTracksByTag(tag, 10);

  const cover = songs[0]?.album_image || "";
  if (cover) {
    iconEl.style.backgroundImage = `url(${cover})`;
    iconEl.style.backgroundColor = "transparent";
    iconEl.style.backgroundSize = "cover";
    iconEl.style.backgroundPosition = "center";
  } else {
    iconEl.style.backgroundImage = "none";
  }

  renderSongs(songs);
}

function renderSongs(songs) {
  if (!songsWrap) return;
  songsWrap.innerHTML = "";

  songs.forEach((track, index) => {
    const wrapper = document.createElement("div");
    const row = document.createElement("div");
    row.className = "song-item";

    const title = track.name || track.title || "Unknown Title";
    const artist = track.artist_name || track.artist || "Unknown Artist";
    const cover = track.album_image || track.albumArt || track.cover || "";

    row.innerHTML = `
      <div class="song-left">
        <div class="song-thumb">
          <img src="${
            cover || FALLBACK_IMG
          }" alt="" onerror="this.src='${FALLBACK_IMG}'">
        </div>
        <div class="song-info">
          <span class="song-title">${title}</span>
          <span class="song-artist">${artist}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="${
          import.meta.env.BASE_URL
        }Media/More-icon.svg">
      </button>
    `;

    wrapper.appendChild(row);
    const hr = document.createElement("hr");
    hr.classList.add("song-separator");

    songsWrap.appendChild(wrapper);
    songsWrap.appendChild(hr);

    row.querySelector(".song-menu")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMorePopup(e.currentTarget, track);
    });

    row.addEventListener("click", () => {
      const event = new CustomEvent("play-request", {
        detail: {
          track: track,
          index: index,
          playlist: songs,
        },
      });
      window.dispatchEvent(event);
    });
  });
}
