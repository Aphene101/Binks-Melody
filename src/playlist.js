import { db, auth } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

const params = new URLSearchParams(window.location.search);
let playlistId = params.get('id');
console.log("Playlist ID from URL:", playlistId);

if (!playlistId) {
  alert('No playlist selected. Redirecting to playlists page.');
  window.location.href = './playlists.html';
}

const backBtn = document.getElementById('pl-back');
const nameEl = document.getElementById('pl-name');
const iconEl = document.getElementById('pl-icon');
const songsWrap = document.getElementById('pl-songs');

let currentUserId = null;

backBtn.addEventListener('click', () => {
  window.location.href = 'playlists.html';
});

auth.onAuthStateChanged(async (user) => {
  if (!playlistId) {
    console.warn('No playlist id found');
    return;
  }
  if (user) {
    currentUserId = user.uid;
    await loadPlaylist(user.uid, playlistId);
  }
});

async function loadPlaylist(uid, id) {
  const ref = doc(db, 'users', uid, 'playlists', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  nameEl.textContent = data.name || 'Untitled Playlist';

  let songs = [];
  if (Array.isArray(data.songs) && data.songs.length) {
    songs = data.songs;
  } else {
    const songsCol = collection(db, 'users', uid, 'playlists', id, 'songs');
    const songsSnap = await getDocs(songsCol);
    songs = songsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  const cover =
    songs[0]?.album_image || songs[0]?.albumArt || songs[0]?.cover || '';
    if (cover) {
        iconEl.style.backgroundImage = `url(${cover})`;
        iconEl.style.backgroundColor = 'transparent';
        iconEl.style.backgroundSize = 'cover';
        iconEl.style.backgroundPosition = 'center';
    } else {
        iconEl.style.backgroundImage = 'none';
    }

    renderSongs(songs);
}

function renderSongs(songs) {
  songsWrap.innerHTML = '';

  songs.forEach((track, index) => {
    const wrapper = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'song-item';

    const title  = track.name || track.title || 'Unknown Title';
    const artist = track.artist_name || track.artist || 'Unknown Artist';
    const cover  = track.album_image || track.albumArt || track.cover || '';

    row.innerHTML = `
      <div class="song-left">
        <div class="song-thumb">
          <img src="${cover}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${title}</span>
          <span class="song-artist">${artist}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="${import.meta.env.BASE_URL}Media/More-icon.svg">
      </button>
    `;

    wrapper.appendChild(row);
    const hr = document.createElement('hr');
    hr.classList.add('song-separator');

    songsWrap.appendChild(wrapper);
    songsWrap.appendChild(hr);

    row.querySelector('.song-menu').addEventListener('click', (e) => {
      e.stopPropagation();
      openMorePopup(e.currentTarget, track);
    });

    row.addEventListener('click', () => {
      const event = new CustomEvent('play-request', {
        detail: {
          track: track,
          index: index,
          playlist: songs
        }
      });
      window.dispatchEvent(event);
    });
  });
}