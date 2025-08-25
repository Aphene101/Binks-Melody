const CLIENT_ID = '804bfeee';

// Search function
async function searchTracks(query) {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&search=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

const searchInput = document.querySelector('.search-input');
const sectionTitle = document.querySelector('.section-title');
const gridContainer = document.querySelector('.grid-container');
const resultsContainer = document.getElementById('search-results');

const audioPlayer = document.getElementById('player-audio');
const songTitle = document.getElementById('p-title');
const songArtist = document.getElementById('p-artist');
const songThumb = document.getElementById('p-cover');
const currentEl = document.getElementById('p-current');
const durationEl = document.getElementById('p-duration');
const seekEl = document.getElementById('p-seek');

const playBtn = document.getElementById('p-play');
const prevBtn = document.getElementById('p-prev');
const nextBtn = document.getElementById('p-next');

const playIcon = document.getElementById('play-icon');

let currentPlaylist = [];
let currentIndex = -1;

let audioCtx, analyser, source, dataArray;

// Display search results
function displayResults(tracks) {
    resultsContainer.innerHTML = '';

    tracks.forEach((track, index) => {
        const trackWrapper = document.createElement('div');

        const trackDiv = document.createElement('div');
        trackDiv.classList.add('song-item');

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
            <img class="more-icon" src="${import.meta.env.BASE_URL}Media/More-icon.svg">
        </button>
        `;

        trackDiv.querySelector(".song-left").addEventListener("click", () => {
            playTrack(track.audio, track, index, tracks);
        });

        trackWrapper.appendChild(trackDiv);

        const hr = document.createElement('hr');
        hr.classList.add('song-separator');
        trackWrapper.appendChild(hr);

        resultsContainer.appendChild(trackWrapper);
    });
}

function initVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audioPlayer);

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

// Play selected track
function playTrack(audioUrl, track, index, playlist) {

    songTitle.textContent = track.name;
    songArtist.textContent = track.artist_name;
    songThumb.src = track.album_image;
    playIcon.src = `${import.meta.env.BASE_URL}Media/Pause-icon.svg`;

    document.getElementById('player').classList.add('open');

    audioPlayer.pause();
    const u = new URL(audioUrl);
    const proxied = `/audio-proxy${u.pathname}${u.search}`;
    audioPlayer.src = proxied;
    audioPlayer.load();

    currentPlaylist = playlist;
    currentIndex = index;

    seekEl.value = 0;

    initVisualizer();

    audioPlayer.addEventListener('canplay', function onCanPlay() {
        audioPlayer.removeEventListener('canplay', onCanPlay);
        audioPlayer.play().catch(error => {
            console.warn('Playback failed:', error);
        });
    });
}

audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Update progress bar as song plays
audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekEl.value = pct;
        currentEl.textContent = formatTime(audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('ended', () => {
    if (currentPlaylist.length > 0) {
        currentIndex = (currentIndex + 1) % currentPlaylist.length;
        const nextTrack = currentPlaylist[currentIndex];
        playTrack(nextTrack.audio, nextTrack, currentIndex, currentPlaylist);
    }
});

// Seek when user drags progress bar
seekEl.addEventListener('input', () => {
    if (!audioPlayer.duration) return;
    audioPlayer.currentTime = (seekEl.value / 100) * audioPlayer.duration;
});

if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.src = `${import.meta.env.BASE_URL}Media/Pause-icon.svg`;
      playIcon.alt = 'Pause';
    } else {
      audioPlayer.pause();
      playIcon.src = `${import.meta.env.BASE_URL}Media/Play-icon.svg`;
      playIcon.alt = 'Play';
    }
  });
}

// Helper to format seconds
function formatTime(seconds) {
    const m = Math.floor((seconds || 0) / 60);
    const s = Math.floor((seconds || 0) % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Previous and Next Buttons
prevBtn.addEventListener("click", () => {
    if (currentPlaylist.length > 0) {
        currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        const track = currentPlaylist[currentIndex];
        playTrack(track.audio, track, currentIndex, currentPlaylist);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPlaylist.length > 0) {
        currentIndex = (currentIndex + 1) % currentPlaylist.length;
        const track = currentPlaylist[currentIndex];
        playTrack(track.audio, track, currentIndex, currentPlaylist);
    }
});

// Listen for search input
searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();

    if (query.length > 2) {
        const tracks = await searchTracks(query);
        displayResults(tracks);

        sectionTitle.style.display = 'none';
        gridContainer.style.display = 'none';
        resultsContainer.style.display = 'flex';
    } else {
        resultsContainer.innerHTML = '';
        sectionTitle.style.display = 'flex';
        gridContainer.style.display = 'flex';
        resultsContainer.style.display = 'none';
    }
});

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
    const barWidth = (canvas.width / barCount) - gap;

    const minHeight = 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalWidth = barCount * barWidth + (barCount - 1) * gap;
    const offsetX = (canvas.width - totalWidth) / 2;

    for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = Math.max((value / 255) * canvas.height, minHeight);

        ctx.fillStyle = '#C2CDB3';
        drawBar(ctx, offsetX + i * (barWidth + gap), canvas.height - barHeight, barWidth, barHeight, 10);
    }
}

drawVisualizer();

const player = document.getElementById('player');
const toggleBtn = document.getElementById('player-toggle');

toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    player.classList.toggle('minimized');
});

player.addEventListener('click', (e) => {
  if (!player.classList.contains('minimized')) return;

  if (!playBtn.contains(e.target)) {
    player.classList.remove('minimized');
  }
});