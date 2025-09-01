import{b as S,e as f,i as u,f as E,h as b,j as L,u as C,k as w}from"./firebase-CSTcJY2i.js";import"./jamendo-DTCmRH0q.js";import"./main-Bj0KpwT_.js";const P=new URLSearchParams(window.location.search);let p=P.get("id");console.log("Playlist ID from URL:",p);p||(alert("No playlist selected. Redirecting to playlists page."),window.location.href="./playlists.html");const B=document.getElementById("pl-back")||null,h=document.getElementById("pl-name")||null,m=document.getElementById("pl-icon")||null,y=document.getElementById("pl-songs")||null;let v=null,g=null;const i=document.createElement("div");i.className="song-popup hidden";i.innerHTML=`
  <div class="popup-item" id="pl-removeFromPlaylistBtn">
    <img src="/Binks-Melody/Media/Delete-Icon.svg" alt="Remove">
    <span>Remove from Playlist</span>
  </div>
`;document.body.appendChild(i);function A(n,e){g=e;const t=n.getBoundingClientRect();i.style.top=`${t.bottom+window.scrollY}px`,i.style.left=`${t.left+window.scrollX}px`,i.classList.remove("hidden")}document.addEventListener("click",n=>{i.contains(n.target)||i.classList.add("hidden")});async function I(n,e,t){const a=f(u,"users",n,"playlists",e),s=await E(a);if(s.exists()&&Array.isArray(s.data().songs)){const c=(s.data().songs||[]).filter(l=>(l.id??l.audio)!==(t.id??t.audio));await C(a,{songs:c})}else if(t.id){const o=f(u,"users",n,"playlists",e,"songs",t.id);await w(o)}else{const o=b(u,"users",n,"playlists",e,"songs"),l=(await L(o)).docs.find(d=>(d.data().id??d.data().audio)===(t.id??t.audio));l&&await w(l.ref)}}document.getElementById("pl-removeFromPlaylistBtn")?.addEventListener("click",async()=>{if(i.classList.add("hidden"),!v||!p||!g)return;await I(v,p,g);const e=[...document.querySelectorAll(".song-item")].find(t=>t.querySelector(".song-title")?.textContent===(g.name||g.title));e?.parentElement?.nextElementSibling?.remove?.(),e?.parentElement?.remove?.()});B?.addEventListener("click",()=>{window.location.href="playlists.html"});S.onAuthStateChanged(async n=>{if(!p){console.warn("No playlist id found");return}n&&(v=n.uid,await M(n.uid,p))});async function M(n,e){console.log("Loading playlists");const t=f(u,"users",n,"playlists",e),a=await E(t);if(!a.exists())return;console.log(a+"The snap is above");const s=a.data();h&&(h.textContent=s.name||"Untitled Playlist");let o=[];if(Array.isArray(s.songs)&&s.songs.length)o=s.songs;else{const l=b(u,"users",n,"playlists",e,"songs");o=(await L(l)).docs.map(r=>({id:r.id,...r.data()}))}const c=o[0]?.album_image||o[0]?.albumArt||o[0]?.cover||"";m&&(c?(m.style.backgroundImage=`url(${c})`,m.style.backgroundColor="transparent",m.style.backgroundSize="cover",m.style.backgroundPosition="center"):m.style.backgroundImage="none"),console.log(o),T(o)}function T(n){y&&(y.innerHTML="",n.forEach((e,t)=>{const a=document.createElement("div"),s=document.createElement("div");s.className="song-item";const o=e.name||e.title||"Unknown Title",c=e.artist_name||e.artist||"Unknown Artist",l=e.album_image||e.albumArt||e.cover||"";s.innerHTML=`
      <div class="song-left">
        <div class="song-thumb">
          <img src="${l}" alt="">
        </div>
        <div class="song-info">
          <span class="song-title">${o}</span>
          <span class="song-artist">${c}</span>
        </div>
      </div>
      <button class="song-menu">
        <img class="more-icon" src="/Binks-Melody/Media/More-icon.svg">
      </button>
    `,a.appendChild(s);const d=document.createElement("hr");d.classList.add("song-separator"),y.appendChild(a),y.appendChild(d),s.querySelector(".song-menu")?.addEventListener("click",r=>{r.stopPropagation(),A(r.currentTarget,e)}),s.addEventListener("click",()=>{const r=new CustomEvent("play-request",{detail:{track:e,index:t,playlist:n}});window.dispatchEvent(r)})}))}
