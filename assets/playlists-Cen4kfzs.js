import{b as i,i as d,a as m,j as u}from"./main-Dn7MaRYq.js";const a=document.getElementById("playlistsContainer"),n=document.getElementById("newPlaylistBtn");async function y(){const t=i.currentUser;if(!t)return;const o=d(m,"users",t.uid,"playlists");(await u(o)).forEach(s=>{const r=s.data(),e=document.createElement("div");e.className="playlist",e.innerHTML=`
      <div></div>
      <p>${r.name}</p>
      <span class="more-icon"><img src="/Binks-Melody/Media/More-icon.svg"></span>
      `;const l=document.createElement("hr");a.insertBefore(e,n),a.insertBefore(l,n),e.addEventListener("click",c=>{c.target.closest(".more-icon")||(localStorage.setItem("currentPlaylistId",s.id),window.location.href="playlist.html")})})}i.onAuthStateChanged(t=>{t&&y()});n.addEventListener("click",()=>{});
