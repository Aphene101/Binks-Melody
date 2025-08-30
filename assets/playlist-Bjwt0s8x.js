import{b as u,d as y,a as p,g as v,i as h,j as w}from"./firebase-CSKsPba8.js";import"./jamendo-C4MUqn9a.js";import"./main-BnjCphzg.js";const f=new URLSearchParams(window.location.search);let c=f.get("id");console.log("Playlist ID from URL:",c);c||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="./playlists.html");const b=document.getElementById("pl-back"),E=document.getElementById("pl-name"),l=document.getElementById("pl-icon"),m=document.getElementById("pl-songs");b.addEventListener("click",()=>{window.location.href="playlists.html"});u.onAuthStateChanged(async e=>{if(!c){console.warn("No playlist id found");return}e&&(e.uid,await C(e.uid,c))});async function C(e,n){const r=y(p,"users",e,"playlists",n),a=await v(r);if(!a.exists())return;const t=a.data();E.textContent=t.name||"Untitled Playlist";let s=[];if(Array.isArray(t.songs)&&t.songs.length)s=t.songs;else{const d=h(p,"users",e,"playlists",n,"songs");s=(await w(d)).docs.map(o=>({id:o.id,...o.data()}))}const i=s[0]?.album_image||s[0]?.albumArt||s[0]?.cover||"";i?(l.style.backgroundImage=`url(${i})`,l.style.backgroundColor="transparent",l.style.backgroundSize="cover",l.style.backgroundPosition="center"):l.style.backgroundImage="none",I(s)}function I(e){m.innerHTML="",e.forEach((n,r)=>{const a=document.createElement("div"),t=document.createElement("div");t.className="song-item";const s=n.name||n.title||"Unknown Title",i=n.artist_name||n.artist||"Unknown Artist",d=n.album_image||n.albumArt||n.cover||"";t.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${d}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${s}</span>
          <span class="song-artist">${i}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,a.appendChild(t);const g=document.createElement("hr");g.classList.add("song-separator"),m.appendChild(a),m.appendChild(g),t.querySelector(".song-menu").addEventListener("click",o=>{o.stopPropagation(),openMorePopup(o.currentTarget,n)}),t.addEventListener("click",()=>{const o=new CustomEvent("play-request",{detail:{track:n,index:r,playlist:e}});window.dispatchEvent(o)})})}
