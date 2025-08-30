import{b as u,d as y,a as p,g as f,i as h,j as b}from"./firebase-CSKsPba8.js";import"./jamendo-CYMcmKUE.js";import"./main-BnjCphzg.js";const v=new URLSearchParams(window.location.search);let r=v.get("id");console.log("Playlist ID from URL:",r);r||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="./playlists.html");const w=document.getElementById("pl-back"),E=document.getElementById("pl-name"),a=document.getElementById("pl-icon"),g=document.getElementById("pl-songs");w.addEventListener("click",()=>{window.location.href="playlists.html"});u.onAuthStateChanged(async s=>{if(!r){console.warn("No playlist id found");return}s&&(s.uid,await I(s.uid,r))});async function I(s,n){const l=y(p,"users",s,"playlists",n),e=await f(l);if(!e.exists())return;const o=e.data();E.textContent=o.name||"Untitled Playlist";let t=[];if(Array.isArray(o.songs)&&o.songs.length)t=o.songs;else{const c=h(p,"users",s,"playlists",n,"songs");t=(await b(c)).docs.map(m=>({id:m.id,...m.data()}))}const i=t[0]?.album_image||t[0]?.albumArt||t[0]?.cover||"";i?(a.style.backgroundImage=`url(${i})`,a.style.backgroundColor="transparent",a.style.backgroundSize="cover",a.style.backgroundPosition="center"):a.style.backgroundImage="none",C(t)}function C(s){g.innerHTML="",s.forEach(n=>{const l=document.createElement("div"),e=document.createElement("div");e.className="song-item";const o=n.name||n.title||"Unknown Title",t=n.artist_name||n.artist||"Unknown Artist",i=n.album_image||n.albumArt||n.cover||"";e.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${i}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${o}</span>
          <span class="song-artist">${t}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,l.appendChild(e);const c=document.createElement("hr");c.classList.add("song-separator"),g.appendChild(l),g.appendChild(c),e.querySelector(".song-menu").addEventListener("click",d=>{d.stopPropagation(),openMorePopup(d.currentTarget,n)})})}
