import{b as o,i as g,a as c,j as h,d as m,u as v,k as B}from"./firebase-C1ouNFIi.js";import"./main-tyq-dpBh.js";const u=document.getElementById("playlistsContainer"),p=document.getElementById("newPlaylistBtn"),t=document.createElement("div");t.className="playlist-popup hidden";t.innerHTML=`
  <div class="popup-item" id="renameBtn">
    <img src="/Binks-Melody/Media/Rename-icon.svg" alt="Rename">
    <span>Rename</span>
  </div>
  <hr>
  <div class="popup-item" id="deleteBtn">
    <img src="/Binks-Melody/Media/Delete-Icon.svg" alt="Delete">
    <span>Delete</span>
  </div>
`;document.body.appendChild(t);let i=null;async function w(){const e=o.currentUser;if(!e)return;const n=g(c,"users",e.uid,"playlists");(await h(n)).forEach(r=>{const y=r.data(),s=document.createElement("div");s.className="playlist",s.innerHTML=`
      <div></div>
      <p>${y.name}</p>
      <span class="more-icon"><img src="/Binks-Melody/Media/More-icon.svg"></span>
      `;const f=document.createElement("hr");u.insertBefore(s,p),u.insertBefore(f,p),s.addEventListener("click",l=>{l.target.closest(".more-icon")||(localStorage.setItem("currentPlaylistId",r.id),window.location.href="playlist.html")}),s.querySelector(".more-icon").addEventListener("click",l=>{if(l.stopPropagation(),!t.classList.contains("hidden")){t.classList.add("hidden");return}i=r.id;const d=l.target.getBoundingClientRect();t.style.top=`${d.bottom+window.scrollY}px`,t.style.left=`${d.left+window.scrollX}px`,t.classList.remove("hidden")})})}document.addEventListener("click",e=>{t.contains(e.target)||t.classList.add("hidden")});document.getElementById("renameBtn").addEventListener("click",async()=>{const e=prompt("Enter new playlist name:");if(!e)return;const n=o.currentUser;if(!n||!i)return;const a=m(c,"users",n.uid,"playlists",i);await v(a,{name:e}),location.reload()});document.getElementById("deleteBtn").addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this playlist?"))return;const n=o.currentUser;if(!n||!i)return;const a=m(c,"users",n.uid,"playlists",i);await B(a),location.reload()});o.onAuthStateChanged(e=>{e&&w()});
