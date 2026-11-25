export const DEMO_USERS = [
  { uid: "demo-warga", name: "Warga Demo", email: "warga@glowgrid.demo", password: "Warga123!", role: "warga", phone: "081234567890" },
  { uid: "demo-admin", name: "Admin GlowGrid", email: "admin@glowgrid.demo", password: "Admin123!", role: "admin", phone: "" },
  { uid: "demo-tech-1", name: "Arif Nugroho", email: "teknisi@glowgrid.demo", password: "Teknisi123!", role: "teknisi", phone: "" },
  { uid: "demo-tech-2", name: "Dinda Maharani", email: "dinda@glowgrid.demo", password: "Teknisi123!", role: "teknisi", phone: "" },
  { uid: "demo-tech-3", name: "Raka Pratama", email: "raka@glowgrid.demo", password: "Teknisi123!", role: "teknisi", phone: "" }
];

export const LOCATIONS = {
  "Depot Pakal": [-7.2408, 112.6260],
  "Babat Jerawat": [-7.2429, 112.6267],
  "Benowo": [-7.2398, 112.6072],
  "Pakal": [-7.2400, 112.6195],
  "Sumber Rejo": [-7.2160, 112.6072]
};

export const SAMPLE_REPORTS = [
  { id:"GGR-2601", ownerId:"demo-warga", reporter:"Warga Demo", phone:"081234567890", category:"Lampu padam", severity:3, description:"Dua lampu jalan padam dan bagian tikungan sangat gelap pada malam hari.", village:"Babat Jerawat", address:"Jl. Raya Babat Jerawat, dekat RW 06", lat:-7.2424, lng:112.6278, status:"Menunggu Verifikasi", technicianId:"", technicianName:"", createdAt:"2026-11-23T08:12:00+07:00" },
  { id:"GGR-2602", ownerId:"demo-citizen-2", reporter:"Bagus Setiawan", phone:"085700000908", category:"Penerangan kurang", severity:2, description:"Jarak antarlampu cukup jauh sehingga jalur pejalan kaki kurang terang.", village:"Sumber Rejo", address:"Jalan Sumber Rejo sisi utara", lat:-7.2170, lng:112.6083, status:"Menunggu Verifikasi", technicianId:"", technicianName:"", createdAt:"2026-11-23T08:38:00+07:00" },
  { id:"GGR-2603", ownerId:"demo-citizen-3", reporter:"Rizky Ananda", phone:"082100000411", category:"Menyala pada siang hari", severity:1, description:"Satu lampu tetap menyala sejak pagi di sekitar akses permukiman.", village:"Pakal", address:"Jl. Pakal Madya, dekat pertigaan", lat:-7.2392, lng:112.6204, status:"Ditugaskan", technicianId:"demo-tech-1", technicianName:"Arif Nugroho", createdAt:"2026-11-22T17:20:00+07:00" },
  { id:"GGR-2604", ownerId:"demo-citizen-4", reporter:"Sari Wulandari", phone:"081300000772", category:"Tiang/kabel bermasalah", severity:3, description:"Penutup kabel pada tiang terlihat terbuka. Mohon dilakukan pemeriksaan petugas.", village:"Benowo", address:"Dekat Stasiun Benowo", lat:-7.2342, lng:112.6152, status:"Menuju Lokasi", technicianId:"demo-tech-2", technicianName:"Dinda Maharani", createdAt:"2026-11-22T16:05:00+07:00" },
  { id:"GGR-2605", ownerId:"demo-warga", reporter:"Warga Demo", phone:"081234567890", category:"Lampu padam", severity:2, description:"Lampu di depan fasilitas olahraga padam dan sudah diperiksa secara visual oleh warga.", village:"Babat Jerawat", address:"Akses Taman Cahaya", lat:-7.2413, lng:112.6229, status:"Selesai", technicianId:"demo-tech-3", technicianName:"Raka Pratama", createdAt:"2026-11-21T19:42:00+07:00" }
];

export function escapeHTML(value = "") { const div=document.createElement("div"); div.textContent=String(value); return div.innerHTML; }
export function priorityLabel(n) { return Number(n)===3 ? "Tinggi" : Number(n)===2 ? "Sedang" : "Rendah"; }
export function priorityClass(n) { return Number(n)===3 ? "high" : Number(n)===2 ? "medium" : "low"; }
export function statusClass(v="") { return v.replaceAll(" ", "-"); }
export function formatDate(value) { const date=value?.toDate ? value.toDate() : new Date(value); return new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(date); }
export function toast(message) { const el=document.getElementById("toast"); if(!el) return; el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),3000); }
export function redirectFor(role) { location.href = role === "admin" ? "admin.html" : role === "teknisi" ? "teknisi.html" : "warga.html"; }
export function parseCoordinates(value) {
  const text=String(value||"").trim().replace(/−/g,"-");
  const direct=text.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  const url=text.match(/(?:@|q=)(-?\d{1,2}(?:\.\d+)?)[,%2C\s]+(-?\d{1,3}(?:\.\d+)?)/i);
  const m=direct||url; if(!m) return null;
  const lat=Number(m[1]),lng=Number(m[2]);
  return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180?{lat,lng}:null;
}
export function distance([a,b],[c,d]) { const r=n=>n*Math.PI/180,R=6371,x=r(c-a),y=r(d-b),q=Math.sin(x/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(y/2)**2; return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q)); }

export function setupPortal(user, roleLabel) {
  const name=document.getElementById("profileName"), role=document.getElementById("profileRole"), avatar=document.getElementById("profileAvatar");
  if(name) name.textContent=user.name; if(role) role.textContent=roleLabel; if(avatar) avatar.textContent=user.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
}

export function initLeafletMap(id, center=[-7.236,112.617], zoom=14) {
  const el=document.getElementById(id); if(!el) return null;
  if(typeof L==="undefined") { el.innerHTML='<div class="map-fallback"><strong>Peta belum dapat dimuat.</strong><br>Periksa koneksi internet lalu muat ulang.</div>'; return null; }
  const map=L.map(id).setView(center,zoom);
  const layer=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Tiles &copy; Esri"}).addTo(map);
  let errors=0,switched=false; layer.on("tileerror",()=>{ if(++errors<3||switched)return; switched=true; map.removeLayer(layer); L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{subdomains:"abc",maxZoom:19,attribution:"&copy; OpenStreetMap contributors, Tiles HOT"}).addTo(map); });
  return map;
}

export function markerIcon(status="Menunggu Verifikasi") {
  const colors={"Menunggu Verifikasi":"#ffb84d","Ditugaskan":"#3e83f8","Menuju Lokasi":"#5552d9","Selesai":"#9a67e8","Ditolak":"#7c8298"};
  return L.divIcon({className:"",html:`<div class="custom-marker" style="background:${colors[status]||colors["Menunggu Verifikasi"]}"><span></span></div>`,iconSize:[26,26],iconAnchor:[12,24]});
}
