import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

const CLIENT_ID = "804bfeee";

let currentUserId = null;
auth.onAuthStateChanged((user) => {
  if (user) currentUserId = user.uid;
});

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("play-request", (e) => {
    const { track, index, playlist } = e.detail;
    console.log("Received play-request for:", track.name);
    currentTrack = track;
    playTrack(track.audio, track, index, playlist);
  });

  const player = document.getElementById("player");
  const toggleBtn = document.getElementById("player-toggle");
  const playBtn = document.getElementById("p-play");

  if (!player || !toggleBtn || !playBtn) {
    console.warn("Minimizer setup skipped: missing elements");
    return;
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    player.classList.toggle("minimized");
  });

  player.addEventListener("click", (e) => {
    if (!player.classList.contains("minimized")) return;
    if (!playBtn.contains(e.target)) {
      player.classList.remove("minimized");
    }
  });

  const addBtn = document.getElementById("p-add");
  if (addBtn) {
    addBtn.addEventListener("click", handleAddToPlaylist);
  }
});

const songPopup = document.createElement("div");
songPopup.className = "song-popup hidden";
songPopup.innerHTML = `
  <div class="popup-item" id="addToPlaylistBtn">
    <img src="${import.meta.env.BASE_URL}Media/Purple-Add-Icon.svg" alt="Add">
    <span>Add to Playlist</span>
  </div>
  <hr>
  <div class="popup-item" id="removeFromPlaylistBtn">
    <img src="${import.meta.env.BASE_URL}Media/Delete-Icon.svg" alt="Remove">
     <span>Remove from Playlist</span>
  </div>
`;
document.body.appendChild(songPopup);

let currentTrack = null;

// Search function
async function searchTracks(query) {
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&search=${encodeURIComponent(
    query
  )}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

const searchInput = document.querySelector(".search-input");
const sectionTitle = document.querySelector(".section-title");
const gridContainer = document.querySelector(".grid-container");
const resultsContainer = document.getElementById("search-results");

const audioPlayer = document.getElementById("player-audio");
const playIcon = document.getElementById("play-icon");
const seekEl = document.getElementById("p-seek");

const currentEl = document.getElementById("p-current");
const durationEl = document.getElementById("p-duration");

const playBtn = document.getElementById("p-play");
const prevBtn = document.getElementById("p-prev");
const nextBtn = document.getElementById("p-next");

let currentPlaylist = [];
let currentIndex = -1;

let audioCtx, analyser, source, dataArray;

// Display search results
function displayResults(tracks) {
  resultsContainer.innerHTML = "";

  tracks.forEach((track, index) => {
    const trackWrapper = document.createElement("div");

    const trackDiv = document.createElement("div");
    trackDiv.classList.add("song-item");

    trackDiv.innerHTML = `
        <div class="song-left">
            <div class="song-thumb">
            <img src="${track.album_image}" alt="Album Art">
            </div>
            <div class="song-info">
            <span class="song-title">${track.name}</span>
            <span class="song-artist">${track.artist_name}</span>
            </div>
        </div>
        <button class="song-menu">
            <img class="more-icon" src="${
              import.meta.env.BASE_URL
            }Media/More-icon.svg">
        </button>
        `;

    trackDiv.querySelector(".song-left").addEventListener("click", () => {
      const event = new CustomEvent("play-request", {
        detail: { track, index, playlist: tracks },
      });
      window.dispatchEvent(event);
    });

    trackDiv.querySelector(".song-menu").addEventListener("click", (e) => {
      e.stopPropagation();
      currentTrack = track;

      const rect = e.currentTarget.getBoundingClientRect();
      songPopup.style.top = `${rect.bottom + window.scrollY}px`;
      songPopup.style.left = `${rect.left + window.scrollX}px`;
      songPopup.classList.remove("hidden");
    });

    trackWrapper.appendChild(trackDiv);

    const hr = document.createElement("hr");
    hr.classList.add("song-separator");
    trackWrapper.appendChild(hr);

    resultsContainer.appendChild(trackWrapper);
  });
}

document.addEventListener("click", (e) => {
  if (!songPopup.contains(e.target)) {
    songPopup.classList.add("hidden");
  }
});

async function handleAddToPlaylist() {
  songPopup.classList.add("hidden");
  if (!currentUserId || !currentTrack) return;

  const chooser = document.createElement("div");
  chooser.className = "playlist-chooser";

  const playlistsCol = collection(db, "users", currentUserId, "playlists");
  const snap = await getDocs(playlistsCol);

  if (snap.empty) {
    const none = document.createElement("div");
    none.className = "playlist-row";
    none.innerHTML = `<p>No playlists found</p>`;
    chooser.appendChild(none);
  } else {
    snap.docs.forEach((pl, index) => {
      const row = document.createElement("div");
      row.className = "playlist-row";

      row.innerHTML = `
            <div class="playlist-icon"></div>
            <p>${pl.data().name || "Untitled Playlist"}</p>
            <span class="add-icon"><img src="${
              import.meta.env.BASE_URL
            }Media/Add-To-Playlist-icon.svg" alt="Add"></span>
            `;

      const iconEl = row.querySelector(".playlist-icon");
      const cover =
        pl.data().songs?.[0]?.album_image ||
        pl.data().songs?.[0]?.albumArt ||
        pl.data().songs?.[0]?.cover ||
        "";

      if (cover) {
        iconEl.style.backgroundImage = `url(${cover})`;
        iconEl.style.backgroundColor = "transparent";
        iconEl.style.backgroundSize = "cover";
        iconEl.style.backgroundPosition = "center";
      } else {
        iconEl.style.backgroundImage = "none";
      }

      row.addEventListener("click", async () => {
        await updateDoc(doc(db, "users", currentUserId, "playlists", pl.id), {
          songs: arrayUnion(currentTrack),
        });
        slideOutAndRemove(chooser);
      });
      chooser.appendChild(row);

      if (index < snap.docs.length - 1) {
        const sep = document.createElement("hr");
        sep.className = "playlist-separator";
        chooser.appendChild(sep);
      }
    });
  }

  document.body.appendChild(chooser);

  chooser.classList.add("show");

  function slideOutAndRemove(element) {
    element.classList.remove("show");
    element.classList.add("hide");
    element.addEventListener("animationend", () => element.remove(), {
      once: true,
    });
  }

  setTimeout(() => {
    document.addEventListener("click", () => slideOutAndRemove(chooser), {
      once: true,
    });
  }, 0);
}

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
      await deleteDoc(
        doc(db, "users", uid, "playlists", playlistId, "songs", track.id)
      );
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

async function handleRemoveFromPlaylist() {
  songPopup.classList.add("hidden");
  if (!currentUserId || !currentTrack) return;

  const chooser = document.createElement("div");
  chooser.className = "playlist-chooser";

  const playlistsCol = collection(db, "users", currentUserId, "playlists");
  const snap = await getDocs(playlistsCol);

  if (snap.empty) {
    const none = document.createElement("div");
    none.className = "playlist-row";
    none.innerHTML = `<p>No playlists found</p>`;
    chooser.appendChild(none);
  } else {
    snap.docs.forEach((pl, index) => {
      const row = document.createElement("div");
      row.className = "playlist-row";
      row.innerHTML = `
        <div class="playlist-icon"></div>
        <p>${pl.data().name || "Untitled Playlist"}</p>
        <span class="add-icon"><img src="${
          import.meta.env.BASE_URL
        }Media/Delete-Icon.svg" alt="Remove"></span>
      `;

      const iconEl = row.querySelector(".playlist-icon");
      const cover =
        pl.data().songs?.[0]?.album_image ||
        pl.data().songs?.[0]?.albumArt ||
        pl.data().songs?.[0]?.cover ||
        "";
      if (cover) {
        iconEl.style.backgroundImage = `url(${cover})`;
        iconEl.style.backgroundColor = "transparent";
        iconEl.style.backgroundSize = "cover";
        iconEl.style.backgroundPosition = "center";
      } else {
        iconEl.style.backgroundImage = "none";
      }

      row.addEventListener("click", async () => {
        await removeTrackFromPlaylist(currentUserId, pl.id, currentTrack);
        slideOutAndRemove(chooser);
      });
      chooser.appendChild(row);

      if (index < snap.docs.length - 1) {
        const sep = document.createElement("hr");
        sep.className = "playlist-separator";
        chooser.appendChild(sep);
      }
    });
  }

  document.body.appendChild(chooser);
  chooser.classList.add("show");

  function slideOutAndRemove(element) {
    element.classList.remove("show");
    element.classList.add("hide");
    element.addEventListener("animationend", () => element.remove(), {
      once: true,
    });
  }

  setTimeout(() => {
    document.addEventListener("click", () => slideOutAndRemove(chooser), {
      once: true,
    });
  }, 0);
}

document
  .getElementById("addToPlaylistBtn")
  .addEventListener("click", handleAddToPlaylist);
document.getElementById("p-add").addEventListener("click", handleAddToPlaylist);
document
  .getElementById("removeFromPlaylistBtn")
  ?.addEventListener("click", handleRemoveFromPlaylist);

function initVisualizer() {
  const audioPlayer = document.getElementById("player-audio");
  if (!audioPlayer) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audioPlayer);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    drawVisualizer();
  }
}

// Play selected track
function playTrack(audioUrl, track, index, playlist) {
  const audioPlayer = document.getElementById("player-audio");
  const songTitle = document.getElementById("p-title");
  const songArtist = document.getElementById("p-artist");
  const playIcon = document.getElementById("play-icon");
  const seekEl = document.getElementById("p-seek");
  const songThumb = document.getElementById("p-cover");

  if (
    !songTitle ||
    !songArtist ||
    !songThumb ||
    !playIcon ||
    !audioPlayer ||
    !seekEl
  ) {
    console.warn("Player elements not found");
    return;
  }

  songTitle.textContent = track.name;
  songArtist.textContent = track.artist_name;
  songThumb.src = track.album_image;
  playIcon.src = `${import.meta.env.BASE_URL}Media/Pause-icon.svg`;

  document.getElementById("player").classList.add("open");

  audioPlayer.pause();
  const u = new URL(audioUrl);
  const proxied = `https://jamendo-proxy.aphene-falcon.workers.dev${u.pathname}${u.search}`;
  audioPlayer.src = proxied;
  audioPlayer.load();

  currentPlaylist = playlist;
  currentIndex = index;

  seekEl.value = 0;

  initVisualizer();

  audioPlayer.addEventListener("canplay", function onCanPlay() {
    audioPlayer.removeEventListener("canplay", onCanPlay);
    audioPlayer.play().catch((error) => {
      console.warn("Playback failed:", error);
    });
  });
}

if (audioPlayer) {
  audioPlayer.addEventListener("loadedmetadata", () => {
    if (durationEl) durationEl.textContent = formatTime(audioPlayer.duration);
  });
}

// Update progress bar as song plays
if (audioPlayer) {
  audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
      const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      if (seekEl) seekEl.value = pct;
      if (currentEl)
        currentEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });
}

if (audioPlayer)
  audioPlayer.addEventListener("ended", () => {
    if (currentPlaylist.length > 0) {
      currentIndex = (currentIndex + 1) % currentPlaylist.length;
      const nextTrack = currentPlaylist[currentIndex];
      playTrack(nextTrack.audio, nextTrack, currentIndex, currentPlaylist);
    }
  });

// Seek when user drags progress bar
seekEl?.addEventListener("input", () => {
  if (!audioPlayer.duration) return;
  audioPlayer.currentTime = (seekEl.value / 100) * audioPlayer.duration;
});

if (playBtn && audioPlayer && playIcon) {
  playBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.src = `${import.meta.env.BASE_URL}Media/Pause-icon.svg`;
      playIcon.alt = "Pause";
    } else {
      audioPlayer.pause();
      playIcon.src = `${import.meta.env.BASE_URL}Media/Play-icon.svg`;
      playIcon.alt = "Play";
    }
  });
}

// Helper to format seconds
function formatTime(seconds) {
  const m = Math.floor((seconds || 0) / 60);
  const s = Math.floor((seconds || 0) % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Previous and Next Buttons
prevBtn?.addEventListener("click", () => {
  if (currentPlaylist.length > 0) {
    currentIndex =
      (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const track = currentPlaylist[currentIndex];
    playTrack(track.audio, track, currentIndex, currentPlaylist);
  }
});

nextBtn?.addEventListener("click", () => {
  if (currentPlaylist.length > 0) {
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
    const track = currentPlaylist[currentIndex];
    playTrack(track.audio, track, currentIndex, currentPlaylist);
  }
});

// Listen for search input (only if this page has a search bar)
if (searchInput) {
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
      const tracks = await searchTracks(query);
      displayResults(tracks);
      if (sectionTitle) sectionTitle.style.display = "none";
      if (gridContainer) gridContainer.style.display = "none";
      if (resultsContainer) resultsContainer.style.display = "flex";
    } else {
      if (resultsContainer) resultsContainer.innerHTML = "";
      if (sectionTitle) sectionTitle.style.display = "flex";
      if (gridContainer) gridContainer.style.display = "flex";
      if (resultsContainer) resultsContainer.style.display = "none";
    }
  });
}

function drawBar(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const gap = 10;
  const barCount = 35;
  const step = Math.floor(dataArray.length / barCount);
  const barWidth = canvas.width / barCount - gap;

  const minHeight = 8;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const totalWidth = barCount * barWidth + (barCount - 1) * gap;
  const offsetX = (canvas.width - totalWidth) / 2;

  for (let i = 0; i < barCount; i++) {
    const value = dataArray[i * step];
    const barHeight = Math.max((value / 255) * canvas.height, minHeight);

    ctx.fillStyle = "#C2CDB3";
    drawBar(
      ctx,
      offsetX + i * (barWidth + gap),
      canvas.height - barHeight,
      barWidth,
      barHeight,
      10
    );
  }
}
