import{b as u,d as y,a as m,g as b,i as v,j as h}from"./firebase-CSKsPba8.js";import"./jamendo-CYMcmKUE.js";import"./main-BnjCphzg.js";const f=new URLSearchParams(window.location.search);let p=f.get("id")||localStorage.getItem("currentPlaylistId");const w=document.getElementById("pl-back"),E=document.getElementById("pl-name"),a=document.getElementById("pl-icon"),d=document.getElementById("pl-songs");w.addEventListener("click",()=>{window.location.href="playlists.html"});u.onAuthStateChanged(async t=>{if(!p){console.warn("No playlist id found");return}t&&(t.uid,await I(t.uid,p))});async function I(t,n){const l=y(m,"users",t,"playlists",n),e=await b(l);if(!e.exists())return;const o=e.data();E.textContent=o.name||"Untitled Playlist";let s=[];if(Array.isArray(o.songs)&&o.songs.length)s=o.songs;else{const c=v(m,"users",t,"playlists",n,"songs");s=(await h(c)).docs.map(g=>({id:g.id,...g.data()}))}const i=s[0]?.album_image||s[0]?.albumArt||s[0]?.cover||"";i?(a.style.backgroundImage=`url(${i})`,a.style.backgroundColor="transparent",a.style.backgroundSize="cover",a.style.backgroundPosition="center"):a.style.backgroundImage="none",S(s)}function S(t){d.innerHTML="",t.forEach(n=>{const l=document.createElement("div"),e=document.createElement("div");e.className="song-item";const o=n.name||n.title||"Unknown Title",s=n.artist_name||n.artist||"Unknown Artist",i=n.album_image||n.albumArt||n.cover||"";e.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${i}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${o}</span>
          <span class="song-artist">${s}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,l.appendChild(e);const c=document.createElement("hr");c.classList.add("song-separator"),d.appendChild(l),d.appendChild(c),e.querySelector(".song-menu").addEventListener("click",r=>{r.stopPropagation(),openMorePopup(r.currentTarget,n)})})}
