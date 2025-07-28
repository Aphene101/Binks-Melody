import { db, auth } from './firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

const playlistsContainer = document.getElementById('playlistsContainer');
const newPlaylistBtn = document.getElementById('newPlaylistBtn');

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
      <div></div>
      <p>${data.name}</p>
      <span class="more-icon"><img src="${import.meta.env.BASE_URL}Media/More-icon.svg"></span>
      `;

    const hr = document.createElement('hr');

    playlistsContainer.insertBefore(playlistDiv, newPlaylistBtn);
    playlistsContainer.insertBefore(hr, newPlaylistBtn);

    playlistDiv.addEventListener('click', () => {
      localStorage.setItem('currentPlaylistId', doc.id);
      window.location.href = 'playlist.html';
    });
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    renderPlaylists();
  }
});

newPlaylistBtn.addEventListener('click', () => {

});