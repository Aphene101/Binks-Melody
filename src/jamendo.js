const CLIENT_ID = '804bfeee';

// Search function
async function searchTracks(query) {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&search=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// Display search results
function displayResults(tracks) {
    const resultsContainer = document.querySelector('.search-results');
    resultsContainer.innerHTML = '';

    tracks.forEach(track => {
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
        <button class="song-menu" onclick="playTrack('${track.audio}')"><img class="more-icon" src="${import.meta.env.BASE_URL}Media/More-icon.svg"></button>
        `;


        trackWrapper.appendChild(trackDiv);

        const hr = document.createElement('hr');
        hr.classList.add('song-separator');
        trackWrapper.appendChild(hr);

        resultsContainer.appendChild(trackWrapper);
    });
}

// Play selected track
function playTrack(audioUrl) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

// Listen for search input
document.querySelector('.search-input').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
        const tracks = await searchTracks(query);
        displayResults(tracks);
    } else {
        document.querySelector('.search-results').innerHTML = '';
    }
});

const searchInput = document.querySelector('.search-input');
const searchResults = document.getElementById('search-results');
const sectionTitle = document.querySelector('.section-title');
const gridContainer = document.querySelector('.grid-container');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (query) {
        sectionTitle.style.display = 'none';
        gridContainer.style.display = 'none';
        searchResults.style.display = 'flex';
    } else {
        sectionTitle.style.display = 'flex';
        gridContainer.style.display = 'flex';
        searchResults.style.display = 'none';
    }
});