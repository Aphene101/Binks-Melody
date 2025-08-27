import { db, auth } from './firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const playlistsContainer = document.getElementById('playlistsContainer');
const newPlaylistBtn = document.getElementById('newPlaylistBtn');

const popupMenu = document.createElement('div');
popupMenu.className = 'playlist-popup hidden';
popupMenu.innerHTML = `
  <div class="popup-item" id="renameBtn">
    <img src="${import.meta.env.BASE_URL}Media/Rename-icon.svg" alt="Rename">
    <span>Rename</span>
  </div>
  <hr>
  <div class="popup-item" id="deleteBtn">
    <img src="${import.meta.env.BASE_URL}Media/Delete-Icon.svg" alt="Delete">
    <span>Delete</span>
  </div>
`;
document.body.appendChild(popupMenu);

let currentPlaylistId = null;

async function renderPlaylists() {
  const user = auth.currentUser;
  if (!user) return;

  const q = collection(db, "users", user.uid, "playlists");
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const playlistDiv = document.createElement('div');
    playlistDiv.className = 'playlist';

    playlistDiv.innerHTML = `
      <div class="pl-icon"></div>
      <p>${data.name}</p>
      <span class="more-icon"><img src="${import.meta.env.BASE_URL}Media/More-icon.svg"></span>
    `;

    const iconEl = playlistDiv.querySelector('.pl-icon');
    const cover = data.songs?.[0]?.album_image || data.songs?.[0]?.albumArt || data.songs?.[0]?.cover || '';

    if (cover) {
      iconEl.style.backgroundImage = `url(${cover})`;
      iconEl.style.backgroundColor = 'transparent';
      iconEl.style.backgroundSize = 'cover';
      iconEl.style.backgroundPosition = 'center';
    } else {
      iconEl.style.backgroundImage = 'none';
    }


    const hr = document.createElement('hr');

    playlistsContainer.insertBefore(playlistDiv, newPlaylistBtn);
    playlistsContainer.insertBefore(hr, newPlaylistBtn);

    playlistDiv.addEventListener('click', (event) => {
      if (event.target.closest('.more-icon')) return;
      localStorage.setItem('currentPlaylistId', doc.id);
      window.location.href = 'playlist.html';
    });

    playlistDiv.querySelector('.more-icon').addEventListener('click', (e) => {
      e.stopPropagation();

      if (!popupMenu.classList.contains('hidden')) {
        popupMenu.classList.add('hidden');
        return;
      }

      currentPlaylistId = doc.id;

      const rect = e.target.getBoundingClientRect();
      popupMenu.style.top = `${rect.bottom + window.scrollY}px`;
      popupMenu.style.left = `${rect.left + window.scrollX}px`;
      popupMenu.classList.remove('hidden');
    });
  });
}

document.addEventListener('click', (e) => {
  if (!popupMenu.contains(e.target)) {
    popupMenu.classList.add('hidden');
  }
});

document.getElementById('renameBtn').addEventListener('click', async () => {
  const newName = prompt("Enter new playlist name:");
  if (!newName) return;

  const user = auth.currentUser;
  if (!user || !currentPlaylistId) return;

  const playlistRef = doc(db, "users", user.uid, "playlists", currentPlaylistId);
  await updateDoc(playlistRef, { name: newName });

  location.reload();
});

document.getElementById('deleteBtn').addEventListener('click', async () => {
  const confirmDelete = confirm("Are you sure you want to delete this playlist?");
  if (!confirmDelete) return;

  const user = auth.currentUser;
  if (!user || !currentPlaylistId) return;

  const playlistRef = doc(db, "users", user.uid, "playlists", currentPlaylistId);
  await deleteDoc(playlistRef);

  location.reload();
});

auth.onAuthStateChanged(user => {
  if (user) {
    renderPlaylists();
  }
});