import{b as u,d as y,a as p,g as v,i as h,j as w}from"./firebase-CSKsPba8.js";import"./jamendo-BDwQC619.js";import"./main-BhY9c6qt.js";const b=new URLSearchParams(window.location.search);let c=b.get("id");console.log("Playlist ID from URL:",c);c||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="./playlists.html");const f=document.getElementById("pl-back"),E=document.getElementById("pl-name"),l=document.getElementById("pl-icon"),m=document.getElementById("pl-songs");f.addEventListener("click",()=>{window.location.href="playlists.html"});u.onAuthStateChanged(async t=>{if(!c){console.warn("No playlist id found");return}t&&(t.uid,await L(t.uid,c))});async function L(t,n){console.log("Loading playlists");const r=y(p,"users",t,"playlists",n),a=await v(r);if(!a.exists())return;console.log(a+"The snap is above");const s=a.data();E.textContent=s.name||"Untitled Playlist";let e=[];if(Array.isArray(s.songs)&&s.songs.length)e=s.songs;else{const d=h(p,"users",t,"playlists",n,"songs");e=(await w(d)).docs.map(o=>({id:o.id,...o.data()}))}const i=e[0]?.album_image||e[0]?.albumArt||e[0]?.cover||"";i?(l.style.backgroundImage=`url(${i})`,l.style.backgroundColor="transparent",l.style.backgroundSize="cover",l.style.backgroundPosition="center"):l.style.backgroundImage="none",console.log(e),C(e)}function C(t){m.innerHTML="",t.forEach((n,r)=>{const a=document.createElement("div"),s=document.createElement("div");s.className="song-item";const e=n.name||n.title||"Unknown Title",i=n.artist_name||n.artist||"Unknown Artist",d=n.album_image||n.albumArt||n.cover||"";s.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${d}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${e}</span>
          <span class="song-artist">${i}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,a.appendChild(s);const g=document.createElement("hr");g.classList.add("song-separator"),m.appendChild(a),m.appendChild(g),s.querySelector(".song-menu").addEventListener("click",o=>{o.stopPropagation(),openMorePopup(o.currentTarget,n)}),s.addEventListener("click",()=>{const o=new CustomEvent("play-request",{detail:{track:n,index:r,playlist:t}});window.dispatchEvent(o)})})}
