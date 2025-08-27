import{b as u,d as y,a as p,g as h,i as b,j as f}from"./firebase-CSKsPba8.js";import"./jamendo-CYMcmKUE.js";import"./main-BnjCphzg.js";const v=new URLSearchParams(window.location.search);let g=v.get("id");g||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="playlists.html");const w=document.getElementById("pl-back"),E=document.getElementById("pl-name"),a=document.getElementById("pl-icon"),d=document.getElementById("pl-songs");w.addEventListener("click",()=>{window.location.href="playlists.html"});u.onAuthStateChanged(async t=>{if(!g){console.warn("No playlist id found");return}t&&(t.uid,await C(t.uid,g))});async function C(t,n){const i=y(p,"users",t,"playlists",n),e=await h(i);if(!e.exists())return;const o=e.data();E.textContent=o.name||"Untitled Playlist";let s=[];if(Array.isArray(o.songs)&&o.songs.length)s=o.songs;else{const c=b(p,"users",t,"playlists",n,"songs");s=(await f(c)).docs.map(m=>({id:m.id,...m.data()}))}const l=s[0]?.album_image||s[0]?.albumArt||s[0]?.cover||"";l?(a.style.backgroundImage=`url(${l})`,a.style.backgroundColor="transparent",a.style.backgroundSize="cover",a.style.backgroundPosition="center"):a.style.backgroundImage="none",I(s)}function I(t){d.innerHTML="",t.forEach(n=>{const i=document.createElement("div"),e=document.createElement("div");e.className="song-item";const o=n.name||n.title||"Unknown Title",s=n.artist_name||n.artist||"Unknown Artist",l=n.album_image||n.albumArt||n.cover||"";e.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${l}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${o}</span>
          <span class="song-artist">${s}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,i.appendChild(e);const c=document.createElement("hr");c.classList.add("song-separator"),d.appendChild(i),d.appendChild(c),e.querySelector(".song-menu").addEventListener("click",r=>{r.stopPropagation(),openMorePopup(r.currentTarget,n)})})}
