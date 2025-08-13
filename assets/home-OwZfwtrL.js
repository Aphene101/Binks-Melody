import"./firebase-BjFFdFpZ.js";import"./main-DTeVVOWb.js";const d="804bfeee";async function u(s){const e=`https://api.jamendo.com/v3.0/tracks/?client_id=${d}&format=json&limit=10&search=${encodeURIComponent(s)}`;return(await(await fetch(e)).json()).results}function m(s){const e=document.querySelector(".search-results");e.innerHTML="",s.forEach(t=>{const n=document.createElement("div"),a=document.createElement("div");a.classList.add("song-item"),a.innerHTML=`
        <div class="song-left">
            <div class="song-thumb">
            <img src="${t.album_image}" alt="Album Art">
            </div>
            <div class="song-info">
            <span class="song-title">${t.name}</span>
            <span class="song-artist">${t.artist_name}</span>
            </div>
        </div>
        <button class="song-menu" onclick="playTrack('${t.audio}')"><img class="more-icon" src="/public/Media/More-icon.svg"></button>
        `,n.appendChild(a);const c=document.createElement("hr");c.classList.add("song-separator"),n.appendChild(c),e.appendChild(n)})}document.querySelector(".search-input").addEventListener("input",async s=>{const e=s.target.value.trim();if(e.length>2){const t=await u(e);m(t)}else document.querySelector(".search-results").innerHTML=""});const o=document.querySelector(".search-input"),r=document.getElementById("search-results"),i=document.querySelector(".section-title"),l=document.querySelector(".grid-container");o.addEventListener("input",()=>{o.value.trim()?(i.style.display="none",l.style.display="none",r.style.display="flex"):(i.style.display="flex",l.style.display="flex",r.style.display="none")});
