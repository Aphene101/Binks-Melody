import"./firebase-BcYGz8gK.js";import"./main-DNTuINcL.js";const m="804bfeee";async function p(n){const t=`https://api.jamendo.com/v3.0/tracks/?client_id=${m}&format=json&limit=10&search=${encodeURIComponent(n)}`;return(await(await fetch(t)).json()).results}const y=document.querySelector(".search-input"),r=document.querySelector(".section-title"),d=document.querySelector(".grid-container"),o=document.getElementById("search-results");document.querySelector(".player");const e=document.getElementById("player-audio"),g=document.getElementById("p-title"),E=document.getElementById("p-artist"),v=document.getElementById("p-cover"),f=document.getElementById("p-current");document.getElementById("p-duration");const i=document.getElementById("p-seek"),u=document.getElementById("p-play");document.getElementById("p-prev");document.getElementById("p-next");function h(n){o.innerHTML="",n.forEach(t=>{const s=document.createElement("div"),a=document.createElement("div");a.classList.add("song-item"),a.innerHTML=`
        <div class="song-left">
            <div class="song-thumb">
            <img src="${t.album_image}" alt="Album Art">
            </div>
            <div class="song-info">
            <span class="song-title">${t.name}</span>
            <span class="song-artist">${t.artist_name}</span>
            </div>
        </div>
        <button class="song-menu">
            <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
        </button>
        `,a.querySelector(".song-menu").addEventListener("click",()=>B(t.audio,t)),s.appendChild(a);const l=document.createElement("hr");l.classList.add("song-separator"),s.appendChild(l),o.appendChild(s)})}function B(n,t){g.textContent=t.name,E.textContent=t.artist_name,v.src=t.album_image,document.getElementById("player").classList.add("open"),e.pause(),e.src=n,e.load(),e.addEventListener("canplay",function s(){e.removeEventListener("canplay",s),e.play().catch(a=>{console.warn("Playback failed:",a)})})}e.addEventListener("timeupdate",()=>{if(e.duration){const n=e.currentTime/e.duration*100;i.value=n,f.textContent=I(e.currentTime)}});i.addEventListener("input",()=>{e.duration&&(e.currentTime=i.value/100*e.duration)});const c=document.getElementById("play-icon");u&&u.addEventListener("click",()=>{e.paused?(e.play(),c.src="/Binks-Melody/Media/Pause-icon.svg",c.alt="Pause"):(e.pause(),c.src="/Binks-Melody/Media/Play-icon.svg",c.alt="Play")});function I(n){const t=Math.floor((n||0)/60),s=Math.floor((n||0)%60);return`${t}:${s<10?"0":""}${s}`}y.addEventListener("input",async n=>{const t=n.target.value.trim();if(t.length>2){const s=await p(t);h(s),r.style.display="none",d.style.display="none",o.style.display="flex"}else o.innerHTML="",r.style.display="flex",d.style.display="flex",o.style.display="none"});
