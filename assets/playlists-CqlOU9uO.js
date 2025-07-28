import{a as i,c as r,d,g as m}from"./main-Dz6aGX0i.js";const a=document.getElementById("playlistsContainer"),n=document.getElementById("newPlaylistBtn");async function u(){const t=i.currentUser;if(!t)return;const l=r(d,"users",t.uid,"playlists");(await m(l)).forEach(s=>{const c=s.data(),e=document.createElement("div");e.className="playlist",e.innerHTML=`
      <div></div>
      <p>${c.name}</p>
      <span class="more-icon"><img src="/public/Media/More-icon.svg"></span>
      `;const o=document.createElement("hr");a.insertBefore(e,n),a.insertBefore(o,n),e.addEventListener("click",()=>{localStorage.setItem("currentPlaylistId",s.id),window.location.href="playlist.html"})})}i.onAuthStateChanged(t=>{t&&u()});n.addEventListener("click",()=>{});
