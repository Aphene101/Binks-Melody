import"./firebase-CbGDgsoV.js";import"./main-DYchdyn9.js";const m="804bfeee";async function p(n){const t=`https://api.jamendo.com/v3.0/tracks/?client_id=${m}&format=json&limit=10&search=${encodeURIComponent(n)}`;return(await(await fetch(t)).json()).results}const y=document.querySelector(".search-input"),d=document.querySelector(".section-title"),r=document.querySelector(".grid-container"),c=document.getElementById("search-results"),e=document.getElementById("player-audio"),g=document.getElementById("p-title"),v=document.getElementById("p-artist"),E=document.getElementById("p-cover"),f=document.getElementById("p-current");document.getElementById("p-duration");const i=document.getElementById("p-seek"),u=document.getElementById("p-play");document.getElementById("p-prev");document.getElementById("p-next");const o=document.getElementById("play-icon");function B(n){c.innerHTML="",n.forEach(t=>{const s=document.createElement("div"),a=document.createElement("div");a.classList.add("song-item"),a.innerHTML=`
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
        `,a.querySelector(".song-left").addEventListener("click",()=>h(t.audio,t)),s.appendChild(a);const l=document.createElement("hr");l.classList.add("song-separator"),s.appendChild(l),c.appendChild(s)})}function h(n,t){g.textContent=t.name,v.textContent=t.artist_name,E.src=t.album_image,o.src="/Binks-Melody/Media/Pause-icon.svg",document.getElementById("player").classList.add("open"),e.pause(),e.src=n,e.load(),e.addEventListener("canplay",function s(){e.removeEventListener("canplay",s),e.play().catch(a=>{console.warn("Playback failed:",a)})})}e.addEventListener("timeupdate",()=>{if(e.duration){const n=e.currentTime/e.duration*100;i.value=n,f.textContent=I(e.currentTime)}});i.addEventListener("input",()=>{e.duration&&(e.currentTime=i.value/100*e.duration)});u&&u.addEventListener("click",()=>{e.paused?(e.play(),o.src="/Binks-Melody/Media/Pause-icon.svg",o.alt="Pause"):(e.pause(),o.src="/Binks-Melody/Media/Play-icon.svg",o.alt="Play")});function I(n){const t=Math.floor((n||0)/60),s=Math.floor((n||0)%60);return`${t}:${s<10?"0":""}${s}`}y.addEventListener("input",async n=>{const t=n.target.value.trim();if(t.length>2){const s=await p(t);B(s),d.style.display="none",r.style.display="none",c.style.display="flex"}else c.innerHTML="",d.style.display="flex",r.style.display="flex",c.style.display="none"});
