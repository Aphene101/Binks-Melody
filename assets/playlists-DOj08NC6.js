import{a as i,c,d,g as m}from"./main-Dz6aGX0i.js";const a=document.getElementById("playlistsContainer"),n=document.getElementById("newPlaylistBtn");async function y(){const t=i.currentUser;if(!t)return;const l=c(d,"users",t.uid,"playlists");(await m(l)).forEach(s=>{const o=s.data(),e=document.createElement("div");e.className="playlist",e.innerHTML=`
      <div></div>
      <p>${o.name}</p>
      <span class="more-icon"><img src="/Binks-Melody/Media/More-icon.svg"></span>
      `;const r=document.createElement("hr");a.insertBefore(e,n),a.insertBefore(r,n),e.addEventListener("click",()=>{localStorage.setItem("currentPlaylistId",s.id),window.location.href="playlist.html"})})}i.onAuthStateChanged(t=>{t&&y()});n.addEventListener("click",()=>{});
