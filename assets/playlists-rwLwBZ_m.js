import{b as c,i as h,a as u,j as B,d as f,u as E,k}from"./firebase-CSKsPba8.js";import"./main-BhY9c6qt.js";const y=document.getElementById("playlistsContainer"),g=document.getElementById("newPlaylistBtn"),t=document.createElement("div");t.className="playlist-popup hidden";t.innerHTML=`
  <div class="popup-item" id="renameBtn">
    <img src="/Binks-Melody/Media/Rename-icon.svg" alt="Rename">
    <span>Rename</span>
  </div>
  <hr>
  <div class="popup-item" id="deleteBtn">
    <img src="/Binks-Melody/Media/Delete-Icon.svg" alt="Delete">
    <span>Delete</span>
  </div>
`;document.body.appendChild(t);let a=null;async function w(){const e=c.currentUser;if(!e)return;const n=h(u,"users",e.uid,"playlists");(await B(n)).forEach(d=>{const l=d.data(),s=document.createElement("div");s.className="playlist",s.innerHTML=`
      <div class="pl-icon"></div>
      <p>${l.name}</p>
      <span class="more-icon"><img src="/Binks-Melody/Media/More-icon.svg"></span>
    `;const i=s.querySelector(".pl-icon"),m=l.songs?.[0]?.album_image||l.songs?.[0]?.albumArt||l.songs?.[0]?.cover||"";m?(i.style.backgroundImage=`url(${m})`,i.style.backgroundColor="transparent",i.style.backgroundSize="cover",i.style.backgroundPosition="center"):i.style.backgroundImage="none";const v=document.createElement("hr");y.insertBefore(s,g),y.insertBefore(v,g),s.addEventListener("click",r=>{r.target.closest(".more-icon")||(window.location.href=`playlist.html?id=${d.id}`)}),s.querySelector(".more-icon").addEventListener("click",r=>{if(r.stopPropagation(),!t.classList.contains("hidden")){t.classList.add("hidden");return}a=d.id;const p=r.target.getBoundingClientRect();t.style.top=`${p.bottom+window.scrollY}px`,t.style.left=`${p.left+window.scrollX}px`,t.classList.remove("hidden")})})}document.addEventListener("click",e=>{t.contains(e.target)||t.classList.add("hidden")});document.getElementById("renameBtn").addEventListener("click",async()=>{const e=prompt("Enter new playlist name:");if(!e)return;const n=c.currentUser;if(!n||!a)return;const o=f(u,"users",n.uid,"playlists",a);await E(o,{name:e}),location.reload()});document.getElementById("deleteBtn").addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this playlist?"))return;const n=c.currentUser;if(!n||!a)return;const o=f(u,"users",n.uid,"playlists",a);await k(o),location.reload()});c.onAuthStateChanged(e=>{e&&w()});
