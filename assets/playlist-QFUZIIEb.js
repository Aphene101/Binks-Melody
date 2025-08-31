import{b as y,d as f,h as m,e as v,f as h,i as w}from"./firebase-BJqLWyn6.js";import"./jamendo-CAuhc0is.js";import"./main-Bpjt9ygV.js";const b=new URLSearchParams(window.location.search);let r=b.get("id");console.log("Playlist ID from URL:",r);r||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="./playlists.html");const E=document.getElementById("pl-back")||null,u=document.getElementById("pl-name")||null,l=document.getElementById("pl-icon")||null,c=document.getElementById("pl-songs")||null;E?.addEventListener("click",()=>{window.location.href="playlists.html"});y.onAuthStateChanged(async t=>{if(!r){console.warn("No playlist id found");return}t&&(t.uid,await L(t.uid,r))});async function L(t,n){console.log("Loading playlists");const d=f(m,"users",t,"playlists",n),a=await v(d);if(!a.exists())return;console.log(a+"The snap is above");const e=a.data();u&&(u.textContent=e.name||"Untitled Playlist");let s=[];if(Array.isArray(e.songs)&&e.songs.length)s=e.songs;else{const p=h(m,"users",t,"playlists",n,"songs");s=(await w(p)).docs.map(o=>({id:o.id,...o.data()}))}const i=s[0]?.album_image||s[0]?.albumArt||s[0]?.cover||"";l&&(i?(l.style.backgroundImage=`url(${i})`,l.style.backgroundColor="transparent",l.style.backgroundSize="cover",l.style.backgroundPosition="center"):l.style.backgroundImage="none"),console.log(s),P(s)}function P(t){c&&(c.innerHTML="",t.forEach((n,d)=>{const a=document.createElement("div"),e=document.createElement("div");e.className="song-item";const s=n.name||n.title||"Unknown Title",i=n.artist_name||n.artist||"Unknown Artist",p=n.album_image||n.albumArt||n.cover||"";e.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${p}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${s}</span>
          <span class="song-artist">${i}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,a.appendChild(e);const g=document.createElement("hr");g.classList.add("song-separator"),c.appendChild(a),c.appendChild(g),e.querySelector(".song-menu")?.addEventListener("click",o=>{o.stopPropagation(),typeof openMorePopup=="function"?openMorePopup(o.currentTarget,n):console.warn("openMorePopup is not available on this page.")}),e.addEventListener("click",()=>{const o=new CustomEvent("play-request",{detail:{track:n,index:d,playlist:t}});window.dispatchEvent(o)})}))}
