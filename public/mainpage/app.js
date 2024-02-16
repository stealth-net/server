(()=>{"use strict";async function t(t,e,n){return new Promise(((r,s)=>{var i=new XMLHttpRequest;i.open(n,t,!0),i.onload=()=>{if(i.status>=200&&i.status<300){let t;try{t=JSON.parse(i.responseText)}catch(t){return void r(i.responseText)}r(t)}else s(new Error(`HTTP Error: ${i.status}`))},i.onerror=()=>{s(new Error("Network request failed"))};const o="object"==typeof e?JSON.stringify(e):e;"object"==typeof e&&i.setRequestHeader("Content-Type","application/json;charset=UTF-8"),"string"==typeof e&&i.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),i.send(o)}))}function e(e){const n=document.createElement("div");n.id="friend-"+e.id,n.className="friend-container";const r=document.createElement("img");r.setAttribute("width","64"),r.setAttribute("height","64"),r.setAttribute("src",e.pfpURL);const s=document.createElement("div");s.className="friend-status",s.setAttribute("state",e.status);const o=document.createElement("label");o.textContent=e.username;const d=document.createElement("div");d.className="container-actions";const a=document.createElement("button");a.addEventListener("click",(()=>{!function(t){const e=document.createElement("div");e.classList.add("friend-container"),e.setAttribute("state","inactive");const n=document.createElement("div");n.className="container-actions";const r=document.createElement("img");r.width=46,r.height=46,r.src=t.pfpURL;const s=document.createElement("div");s.classList.add("friend-status"),s.setAttribute("state",t.status);const o=document.createElement("label");o.textContent=t.username;const d=document.createElement("button");d.addEventListener("click",(()=>{e.remove()}));const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("width","24"),a.setAttribute("height","24"),a.setAttribute("viewBox","0 0 28 22");const u=document.createElementNS("http://www.w3.org/2000/svg","line");u.setAttribute("x1","2.41421"),u.setAttribute("y1","1.88596"),u.setAttribute("x2","21.114"),u.setAttribute("y2","20.5858"),u.setAttribute("stroke","#6A4040"),u.setAttribute("stroke-width","4");const l=document.createElementNS("http://www.w3.org/2000/svg","line");l.setAttribute("x1","2.23007"),l.setAttribute("y1","20.3978"),l.setAttribute("x2","21.0421"),l.setAttribute("y2","1.58577"),l.setAttribute("stroke","#6A4040"),l.setAttribute("stroke-width","4"),a.appendChild(u),a.appendChild(l),d.appendChild(a),n.appendChild(d),[s,o,e].forEach((e=>{e.addEventListener("click",(()=>{i.forEach((t=>{t.hidden=!0})),c.forEach((t=>{t.removeAttribute("state")})),e.setAttribute("state","active"),document.querySelector("div.dm-user").hidden=!1,document.getElementById("user-message-content").placeholder="Message @"+t.username}))})),e.appendChild(r),e.appendChild(s),e.appendChild(o),e.appendChild(n),document.getElementById("dm-list").appendChild(e)}(e)}));const u=document.createElementNS("http://www.w3.org/2000/svg","svg");u.setAttribute("width","23"),u.setAttribute("height","18"),u.setAttribute("viewBox","0 0 23 18"),u.setAttribute("fill","none");const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","M6.83333 8H6.845M11.5 8H11.5117M16.1667 8H16.1783M22 17L18.1216 15.3378C17.8276 15.2118 17.6806 15.1488 17.5265 15.1044C17.3898 15.065 17.249 15.0365 17.1061 15.0193C16.9451 15 16.7807 15 16.452 15H4.73333C3.42654 15 2.77315 15 2.27402 14.782C1.83497 14.5903 1.47802 14.2843 1.25432 13.908C1 13.4802 1 12.9201 1 11.8V4.2C1 3.07989 1 2.51984 1.25432 2.09202C1.47802 1.71569 1.83497 1.40973 2.27402 1.21799C2.77315 1 3.42655 1 4.73333 1H18.2667C19.5734 1 20.2269 1 20.726 1.21799C21.165 1.40973 21.522 1.71569 21.7457 2.09202C22 2.51984 22 3.0799 22 4.2V17Z"),l.setAttribute("stroke","#51567C"),l.setAttribute("stroke-width","2"),l.setAttribute("stroke-linecap","round"),l.setAttribute("stroke-linejoin","round"),u.appendChild(l),a.appendChild(u);const m=document.createElement("button");m.addEventListener("click",(()=>{t("/user-api/v1/remove-friend",{id:e.id},"POST"),n.remove()}));const p=document.createElementNS("http://www.w3.org/2000/svg","svg");p.setAttribute("width","24"),p.setAttribute("height","24"),p.setAttribute("viewBox","0 0 28 22");const h=document.createElementNS("http://www.w3.org/2000/svg","line");h.setAttribute("x1","2.41421"),h.setAttribute("y1","1.88596"),h.setAttribute("x2","21.114"),h.setAttribute("y2","20.5858"),h.setAttribute("stroke","#6A4040"),h.setAttribute("stroke-width","4");const b=document.createElementNS("http://www.w3.org/2000/svg","line");b.setAttribute("x1","2.23007"),b.setAttribute("y1","20.3978"),b.setAttribute("x2","21.0421"),b.setAttribute("y2","1.58577"),b.setAttribute("stroke","#6A4040"),b.setAttribute("stroke-width","4"),p.appendChild(h),p.appendChild(b),m.appendChild(p),n.appendChild(r),n.appendChild(s),n.appendChild(o),n.appendChild(d),d.appendChild(a),d.appendChild(m),document.getElementById("friend-list").appendChild(n)}function n(e,n){const r=document.createElement("div");r.id="request-"+e.id,r.className="friend-container";const s=document.createElement("img");s.width=64,s.height=64,s.src=e.pfpURL;const i=document.createElement("label");i.style.margin="21px 0px 0px 3px",i.textContent=e.username;const o=document.createElement("div");o.className="container-actions";const c=document.createElement("button");c.addEventListener("click",(()=>{t(n?"/user-api/v1/cancel-friend-request":"/user-api/v1/deny-friend-request",{id:e.id},"POST"),r.remove()}));const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("width","24"),d.setAttribute("height","24"),d.setAttribute("viewBox","0 0 28 22");const a=document.createElementNS("http://www.w3.org/2000/svg","line");a.setAttribute("x1","2.41421"),a.setAttribute("y1","1.88596"),a.setAttribute("x2","21.114"),a.setAttribute("y2","20.5858"),a.setAttribute("stroke","#6A4040"),a.setAttribute("stroke-width","4");const u=document.createElementNS("http://www.w3.org/2000/svg","line");if(u.setAttribute("x1","2.23007"),u.setAttribute("y1","20.3978"),u.setAttribute("x2","21.0421"),u.setAttribute("y2","1.58577"),u.setAttribute("stroke","#6A4040"),u.setAttribute("stroke-width","4"),d.appendChild(a),d.appendChild(u),c.appendChild(d),r.appendChild(s),r.appendChild(i),r.appendChild(o),!n){const n=document.createElement("button");n.addEventListener("click",(()=>{t("/user-api/v1/accept-friend-request",{id:e.id},"POST"),r.remove()}));const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width","21"),s.setAttribute("height","17"),s.setAttribute("viewBox","0 0 21 17");const i=document.createElementNS("http://www.w3.org/2000/svg","line");i.setAttribute("x1","1.34874"),i.setAttribute("y1","8.52322"),i.setAttribute("x2","8.95535"),i.setAttribute("y2","15.4703"),i.setAttribute("stroke","#4E6A40"),i.setAttribute("stroke-width","4");const c=document.createElementNS("http://www.w3.org/2000/svg","line");c.setAttribute("x1","8.58579"),c.setAttribute("y1","12.9263"),c.setAttribute("x2","19.1924"),c.setAttribute("y2","2.31967"),c.setAttribute("stroke","#4E6A40"),c.setAttribute("stroke-width","4"),s.appendChild(i),s.appendChild(c),n.appendChild(s),o.appendChild(n)}o.appendChild(c),document.getElementById("pending-list").appendChild(r)}function r(t){document.getElementById("request-"+t).remove()}document.getElementById("friend-add").addEventListener("click",(async()=>{const e=await t("/user-api/v1/add-friend",{username:document.getElementById("friend-username").value},"POST");e&&n(e,!0)}));const s=document.querySelectorAll('[class^="midsubtab-"]'),i=document.querySelectorAll("#menu-mid > div"),o=document.querySelectorAll(".mid-tabbutton"),c=document.querySelectorAll(".lside-button");o.forEach((t=>{t.addEventListener("click",(()=>{const e=t.getAttribute("tab");o.forEach((t=>{t.removeAttribute("state")})),t.setAttribute("state","active"),s.forEach((t=>{t.hidden=!0}));const n=document.querySelector(`.midsubtab-${e}`);n&&(n.hidden=!1)}))})),c.forEach((t=>{t.addEventListener("click",(function(){const e=t.getAttribute("tab");c.forEach((t=>{t.removeAttribute("state")})),document.querySelectorAll("#dm-list > div").forEach((t=>{t.removeAttribute("state")})),document.getElementById("dm-messages").innerHTML="",t.setAttribute("state","active"),i.forEach((t=>{t.hidden=!0}));const n=document.querySelector(`.midtab-${e}`);n&&(n.hidden=!1)}))}));class d extends EventEmitter{constructor(t={}){super(),this.options=t,async function(t){return new Promise(((t,e)=>{var n=new XMLHttpRequest;n.open("GET","/user-api/v1/get-me",!0),n.onload=()=>{if(n.status>=200&&n.status<300){let e;try{e=JSON.parse(n.responseText)}catch(e){return void t(n.responseText)}t(e)}else e(new Error(`HTTP Error: ${n.status}`))},n.onerror=()=>{e(new Error("Network request failed"))},n.send()}))}().then((t=>{this.user=t,this.emit("fetchedProfile",t)})),this.net={socket:io()}}}const a=function(){var t=document.cookie.split(";"),e={};return t.forEach((function(t){var n=t.split("="),r=n[0].trim(),s=decodeURIComponent(n[1]);e[r]=s})),e}();window.StealthNet={cookie:a,connection:new d({token:a.token||null})},StealthNet.connection.on("fetchedProfile",(function(){const t=document.querySelectorAll("#side-profile label");t[0].innerText=StealthNet.connection.user.username,t[2].innerText=function(t){const e=new Date(t);return`[${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}] ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`}(StealthNet.connection.user.creationTime),document.querySelector("#side-profile img").src=StealthNet.connection.user.pfpURL,StealthNet.connection.user.friends.forEach((async t=>{e(t)})),StealthNet.connection.user.friendRequests.forEach((t=>{n(t,!1)})),StealthNet.connection.user.friendRequestsOwn.forEach((t=>{n(t,!0)}))})),StealthNet.connection.net.socket.on("friendRemove",(t=>function(t){document.getElementById("friend-"+t).remove()}(t))),StealthNet.connection.net.socket.on("friendRequest",(t=>n(t,!1))),StealthNet.connection.net.socket.on("friendRequestCancel",(t=>r(t.id))),StealthNet.connection.net.socket.on("friendRequestAccept",(t=>{e(t),r(t.id)})),StealthNet.connection.net.socket.on("message",(e=>function(e){t("/user-api/v1/send-message",{content:document.getElementById("user-message-content").value},"POST").then((t=>{console.log(t)}));var n=document.createElement("div");n.className="message-container";var r=document.createElement("img");r.src=e.author.pfpURL,r.width=45,r.height=45;var s=document.createElement("div");s.className="message-author";var i=document.createElement("label");i.textContent=e.author.username;var o=document.createElement("label");o.textContent=e.creationTime;var c=document.createElement("div");if(c.className="message-group",s.appendChild(i),s.appendChild(o),e.content){var d=document.createElement("label");d.textContent=e.content,c.appendChild(d)}n.appendChild(r),n.appendChild(s),n.appendChild(c),document.getElementById("dm-messages").appendChild(n)}(e))),StealthNet.connection.net.socket.on("statusChanged",((t,e)=>document.getElementById("friend-"+t).querySelector("div.friend-status").setAttribute("state",e)))})();