import{a as i,q as o,w as d,c as u,g as m,d as y}from"./main-DXWeM3FM.js";const a=document.getElementById("playlistsContainer"),n=document.getElementById("newPlaylistBtn");async function p(){const e=i.currentUser;if(!e)return;const r=o(u(y,"playlists"),d("userId","==",e.uid));(await m(r)).forEach(s=>{const l=s.data(),t=document.createElement("div");t.className="playlist",t.innerHTML=`
      <div></div>
      <p>${l.name}</p>
      <span class="more-icon"><img src="/public/Media/More-icon.svg"></span>
      `;const c=document.createElement("hr");a.insertBefore(t,n),a.insertBefore(c,n),t.addEventListener("click",()=>{localStorage.setItem("currentPlaylistId",s.id),window.location.href="playlist.html"})})}i.onAuthStateChanged(e=>{e&&p()});n.addEventListener("click",()=>{});
