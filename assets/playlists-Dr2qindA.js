import{a as o,g as d,b as m,h as u}from"./main-qBXul_B7.js";const i=document.getElementById("playlistsContainer"),s=document.getElementById("newPlaylistBtn");async function y(){const t=o.currentUser;if(!t)return;const r=d(m,"users",t.uid,"playlists");(await u(r)).forEach(a=>{const l=a.data(),n=document.createElement("div");n.className="playlist",n.innerHTML=`
      <div></div>
      <p>${l.name}</p>
      <span class="more-icon"><img src="/Binks-Melody/Media/More-icon.svg"></span>
      `;const c=document.createElement("hr");i.insertBefore(n,s),i.insertBefore(c,s),n.addEventListener("click",()=>{e.target.closest(".more-icon")||(localStorage.setItem("currentPlaylistId",a.id),window.location.href="playlist.html")})})}o.onAuthStateChanged(t=>{t&&y()});s.addEventListener("click",()=>{});
