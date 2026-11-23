"use strict";

/* =========================================================
   GLOWGRID - struktur data inti
   Stack, Queue, Linked List, Tree, Graph, dan Rekursif
   ========================================================= */

class Stack {
  constructor(items = []) { this.items = items; }
  push(value) { this.items.push(value); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}

class Queue {
  constructor(items = []) { this.items = [...items]; }
  enqueue(value) { this.items.push(value); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}

class ListNode {
  constructor(value) { this.value = value; this.next = null; }
}

class LinkedList {
  constructor() { this.head = null; this.length = 0; }
  append(value) {
    const node = new ListNode(value);
    if (!this.head) this.head = node;
    else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = node;
    }
    this.length++;
  }
  find(predicate) {
    let current = this.head;
    while (current) {
      if (predicate(current.value)) return current.value;
      current = current.next;
    }
    return null;
  }
  remove(predicate) {
    if (!this.head) return null;
    if (predicate(this.head.value)) { const value = this.head.value; this.head = this.head.next; this.length--; return value; }
    let current = this.head;
    while (current.next && !predicate(current.next.value)) current = current.next;
    if (!current.next) return null;
    const value = current.next.value;
    current.next = current.next.next;
    this.length--;
    return value;
  }
  toArray() { const result = []; let current = this.head; while (current) { result.push(current.value); current = current.next; } return result; }
}

class TreeNode {
  constructor(name, type = "wilayah") { this.name = name; this.type = type; this.children = []; }
  addChild(child) { this.children.push(child); return child; }
}

class WeightedGraph {
  constructor() { this.adjacency = {}; }
  addVertex(vertex) { if (!this.adjacency[vertex]) this.adjacency[vertex] = []; }
  addEdge(a, b, weight) {
    this.addVertex(a); this.addVertex(b);
    this.adjacency[a].push({ node: b, weight });
    this.adjacency[b].push({ node: a, weight });
  }
  shortestPath(start, finish) {
    if (!this.adjacency[start] || !this.adjacency[finish]) return { path: [], distance: Infinity };
    const distances = {}; const previous = {}; const unvisited = new Set(Object.keys(this.adjacency));
    Object.keys(this.adjacency).forEach(v => { distances[v] = v === start ? 0 : Infinity; previous[v] = null; });
    while (unvisited.size) {
      let current = [...unvisited].reduce((best, v) => distances[v] < distances[best] ? v : best, [...unvisited][0]);
      if (distances[current] === Infinity) break;
      unvisited.delete(current);
      if (current === finish) break;
      this.adjacency[current].forEach(({ node, weight }) => {
        if (!unvisited.has(node)) return;
        const alternative = distances[current] + weight;
        if (alternative < distances[node]) { distances[node] = alternative; previous[node] = current; }
      });
    }
    const path = []; let cursor = finish;
    while (cursor) { path.unshift(cursor); cursor = previous[cursor]; }
    return { path: path[0] === start ? path : [], distance: distances[finish] };
  }
}

const STORAGE_KEY = "glowgrid_reports_v1";
const ACTIVITY_KEY = "glowgrid_activity_v1";
const TECHNICIANS = ["Arif Nugroho", "Dinda Maharani", "Raka Pratama"];
const LOCATIONS = {
  "Depot Pakal": [-7.2408, 112.6260],
  "Babat Jerawat": [-7.2429, 112.6267],
  "Benowo": [-7.2398, 112.6072],
  "Pakal": [-7.2400, 112.6195],
  "Sumber Rejo": [-7.2160, 112.6072]
};

const sampleReports = [
  { id: "GGR-2601", reporter: "Nadia Putri", phone: "0812xxxx301", category: "Lampu padam", severity: 3, description: "Dua lampu jalan padam dan bagian tikungan menjadi sangat gelap pada malam hari.", village: "Babat Jerawat", address: "Jl. Raya Babat Jerawat, dekat RW 06", lat: -7.2424, lng: 112.6278, status: "Menunggu Verifikasi", technician: "", createdAt: "2026-11-23T08:12:00+07:00" },
  { id: "GGR-2602", reporter: "Bagus Setiawan", phone: "0857xxxx908", category: "Penerangan kurang", severity: 2, description: "Jarak antarlampu cukup jauh sehingga jalur pejalan kaki kurang terang.", village: "Sumber Rejo", address: "Jalan Sumber Rejo sisi utara", lat: -7.2170, lng: 112.6083, status: "Menunggu Verifikasi", technician: "", createdAt: "2026-11-23T08:38:00+07:00" },
  { id: "GGR-2603", reporter: "Rizky Ananda", phone: "0821xxxx411", category: "Menyala pada siang hari", severity: 1, description: "Satu lampu tetap menyala sejak pagi di sekitar akses permukiman.", village: "Pakal", address: "Jl. Pakal Madya, dekat pertigaan", lat: -7.2392, lng: 112.6204, status: "Ditugaskan", technician: "Arif Nugroho", createdAt: "2026-11-22T17:20:00+07:00" },
  { id: "GGR-2604", reporter: "Sari Wulandari", phone: "0813xxxx772", category: "Tiang/kabel bermasalah", severity: 3, description: "Penutup kabel pada tiang terlihat terbuka. Mohon dilakukan pemeriksaan petugas.", village: "Benowo", address: "Dekat Stasiun Benowo", lat: -7.2342, lng: 112.6152, status: "Menuju Lokasi", technician: "Dinda Maharani", createdAt: "2026-11-22T16:05:00+07:00" },
  { id: "GGR-2605", reporter: "Agus Santoso", phone: "0896xxxx134", category: "Lampu padam", severity: 2, description: "Lampu di depan fasilitas olahraga padam dan sudah diperiksa secara visual oleh warga.", village: "Babat Jerawat", address: "Akses Taman Cahaya", lat: -7.2413, lng: 112.6229, status: "Selesai", technician: "Raka Pratama", createdAt: "2026-11-21T19:42:00+07:00" }
];

const sampleActivities = [
  { icon: "✓", text: "GGR-2605 selesai ditangani oleh Raka Pratama", time: "Kemarin, 20.10" },
  { icon: "↗", text: "Dinda Maharani menuju lokasi GGR-2604", time: "Hari ini, 08.05" },
  { icon: "+", text: "Laporan GGR-2602 masuk ke antrean", time: "Hari ini, 08.38" }
];

let reports = loadJSON(STORAGE_KEY, sampleReports);
let activities = loadJSON(ACTIVITY_KEY, sampleActivities);
let actionStack = new Stack();
let reportList = new LinkedList();
let verificationQueue = new Queue();
let regionTree = null;
let selectedAdminId = null;
let maps = { overview: null, report: null, route: null };
let mapLayers = { overview: [], route: [], reportMarker: null };

const regionGraph = new WeightedGraph();
regionGraph.addEdge("Depot Pakal", "Babat Jerawat", 1.1);
regionGraph.addEdge("Depot Pakal", "Pakal", 0.9);
regionGraph.addEdge("Babat Jerawat", "Pakal", 1.3);
regionGraph.addEdge("Babat Jerawat", "Sumber Rejo", 3.5);
regionGraph.addEdge("Pakal", "Benowo", 1.8);
regionGraph.addEdge("Pakal", "Sumber Rejo", 3.0);
regionGraph.addEdge("Benowo", "Sumber Rejo", 2.7);

function loadJSON(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities)); }
function snapshot(action) { actionStack.push({ reports: structuredClone(reports), activities: structuredClone(activities), action }); updateUndo(); }
function undo() {
  const state = actionStack.pop();
  if (!state) return toast("Belum ada tindakan yang dapat diurungkan.");
  reports = state.reports; activities = state.activities; persist(); rebuildStructures(); renderAll(); toast(`Tindakan “${state.action}” berhasil diurungkan.`);
}
function addActivity(icon, text) { activities.unshift({ icon, text, time: "Baru saja" }); activities = activities.slice(0, 12); }
function priorityLabel(severity) { return severity === 3 ? "Tinggi" : severity === 2 ? "Sedang" : "Rendah"; }
function priorityClass(severity) { return severity === 3 ? "high" : severity === 2 ? "medium" : "low"; }
function statusClass(status) { return status.replaceAll(" ", "-"); }
function escapeHTML(value = "") { const div = document.createElement("div"); div.textContent = String(value); return div.innerHTML; }
function formatDate(value) { return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }

function rebuildStructures() {
  reportList = new LinkedList(); reports.forEach(report => reportList.append(report));
  verificationQueue = new Queue(reports.filter(r => r.status === "Menunggu Verifikasi").sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
  regionTree = new TreeNode("Kecamatan Pakal", "kecamatan");
  Object.keys(LOCATIONS).filter(x => x !== "Depot Pakal").forEach(village => {
    const node = regionTree.addChild(new TreeNode(village, "kelurahan"));
    reports.filter(r => r.village === village).forEach(r => node.addChild(new TreeNode(r.id, "laporan")));
  });
}

function traverseRecursive(node, depth = 0, output = []) {
  output.push({ name: node.name, type: node.type, depth });
  node.children.forEach(child => traverseRecursive(child, depth + 1, output));
  return output;
}

function setupNavigation() {
  document.querySelectorAll("[data-section], [data-go]").forEach(button => button.addEventListener("click", () => showSection(button.dataset.section || button.dataset.go)));
  document.getElementById("menuBtn").addEventListener("click", event => {
    const nav = document.querySelector(".nav"); nav.classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  document.getElementById("roleSelect").addEventListener("change", event => {
    const route = { warga: "lapor", admin: "admin", teknisi: "teknisi" }; showSection(route[event.target.value]);
  });
}

function showSection(id) {
  document.querySelectorAll(".page-section").forEach(section => section.classList.toggle("active-section", section.id === id));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.section === id));
  document.querySelector(".nav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  const roleMap = { lapor: "warga", admin: "admin", teknisi: "teknisi" };
  if (roleMap[id]) document.getElementById("roleSelect").value = roleMap[id];
  setTimeout(() => { Object.values(maps).forEach(map => map?.invalidateSize()); if (id === "teknisi") renderTechnician(); }, 80);
}

function initMap(id, center, zoom) {
  const element = document.getElementById(id);
  if (typeof L === "undefined") { element.innerHTML = '<div class="map-fallback"><div><strong>Peta belum dapat dimuat.</strong><br>Hubungkan internet lalu muat ulang halaman. Form lain tetap dapat digunakan.</div></div>'; return null; }
  const map = L.map(id, { zoomControl: true }).setView(center, zoom);
  // Esri dipakai agar tile tetap dapat dimuat saat index.html dibuka langsung
  // melalui file:// tanpa API key. Server tile standar OSM dapat mengembalikan
  // 403 pada pola akses tersebut.
  const primaryLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  }).addTo(map);

  // Jika jaringan memblokir Esri, ganti sekali ke HOT OpenStreetMap.
  let tileErrors = 0;
  let fallbackActive = false;
  primaryLayer.on("tileerror", () => {
    tileErrors++;
    if (tileErrors < 3 || fallbackActive) return;
    fallbackActive = true;
    map.removeLayer(primaryLayer);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      subdomains: "abc",
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors, Tiles HOT"
    }).addTo(map);
  });
  return map;
}

function markerIcon(status = "Menunggu Verifikasi") {
  const colors = { "Menunggu Verifikasi": "#ffb84d", "Ditugaskan": "#3e83f8", "Menuju Lokasi": "#5552d9", "Selesai": "#9a67e8", "Ditolak": "#7c8298" };
  return L.divIcon({ className: "", html: `<div class="custom-marker" style="background:${colors[status] || colors["Menunggu Verifikasi"]}"><span></span></div>`, iconSize: [26,26], iconAnchor: [12,24] });
}

function initializeMaps() {
  maps.overview = initMap("overviewMap", [-7.236,112.617], 14);
  maps.report = initMap("reportMap", [-7.236,112.617], 14);
  maps.route = initMap("routeMap", [-7.236,112.617], 14);
  if (maps.report) {
    maps.report.on("click", event => setReportLocation(event.latlng.lat, event.latlng.lng));
    L.circle([-7.236,112.617], { radius: 2800, color: "#5552d9", fillColor: "#5552d9", fillOpacity: .04, weight: 1, dashArray: "5 5" }).addTo(maps.report);
  }
}

function setReportLocation(lat, lng, zoom = 16) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  const input = document.getElementById("coordinates"); input.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  const link = document.getElementById("googleMapLink"); link.href = `https://www.google.com/maps?q=${lat},${lng}`; link.classList.remove("disabled");
  const googleFrame = document.getElementById("googleMapFrame");
  if (googleFrame) googleFrame.src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  if (maps.report) {
    const popup = `<strong>Titik laporan</strong><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    if (mapLayers.reportMarker) mapLayers.reportMarker.setLatLng([lat,lng]).setPopupContent(popup).openPopup();
    else mapLayers.reportMarker = L.marker([lat,lng], { icon: markerIcon() }).addTo(maps.report).bindPopup(popup).openPopup();
    maps.report.setView([lat,lng], zoom);
  }
  const closest = Object.entries(LOCATIONS).filter(([name]) => name !== "Depot Pakal").sort((a,b) => distance([lat,lng],a[1]) - distance([lat,lng],b[1]))[0];
  if (closest) document.getElementById("village").value = closest[0];
  return true;
}

function parseCoordinates(value) {
  const text = String(value || "").trim().replace(/−/g, "-");
  const direct = text.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  const fromUrl = text.match(/(?:@|q=)(-?\d{1,2}(?:\.\d+)?)[,%2C\s]+(-?\d{1,3}(?:\.\d+)?)/i);
  const match = direct || fromUrl;
  if (!match) return null;
  const lat = Number(match[1]); const lng = Number(match[2]);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 ? { lat, lng } : null;
}
function distance([lat1,lon1],[lat2,lon2]) { const toRad = n => n*Math.PI/180; const R=6371; const dLat=toRad(lat2-lat1); const dLon=toRad(lon2-lon1); const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2; return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); }

function renderOverviewMap() {
  if (!maps.overview) return;
  mapLayers.overview.forEach(layer => layer.remove()); mapLayers.overview = [];
  reports.filter(r => r.status !== "Ditolak").forEach(report => {
    const marker = L.marker([report.lat,report.lng], { icon: markerIcon(report.status) }).addTo(maps.overview).bindPopup(`<strong>${escapeHTML(report.id)}</strong><br>${escapeHTML(report.category)}<br><small>${escapeHTML(report.address)}</small>`);
    mapLayers.overview.push(marker);
  });
}

function renderStats() {
  const waiting = reports.filter(r => r.status === "Menunggu Verifikasi").length;
  const active = reports.filter(r => ["Ditugaskan","Menuju Lokasi"].includes(r.status)).length;
  const done = reports.filter(r => r.status === "Selesai").length;
  const high = reports.filter(r => r.severity === 3 && r.status !== "Selesai").length;
  const cards = [
    ["Laporan menunggu", waiting, "Dalam queue verifikasi", "#fff2d8"],
    ["Inspeksi aktif", active, "Ditangani teknisi", "#e7f0ff"],
    ["Selesai", done, "Penanganan tercatat", "#f0e8ff"],
    ["Prioritas tinggi", high, "Perlu perhatian awal", "#ffe7ea"]
  ];
  document.getElementById("statsGrid").innerHTML = cards.map(c => `<article class="stat-card" style="--tint:${c[3]}"><span>${c[0]}</span><strong>${c[1]}</strong><small>${c[2]}</small></article>`).join("");
  document.getElementById("heroQueue").textContent = `${waiting} laporan`; document.getElementById("asideQueue").textContent = waiting;
}

function renderActivities() {
  const list = document.getElementById("activityList");
  list.innerHTML = activities.length ? activities.slice(0,7).map(a => `<div class="activity-item"><span class="activity-icon">${escapeHTML(a.icon)}</span><div><p>${escapeHTML(a.text)}</p><small>${escapeHTML(a.time)}</small></div></div>`).join("") : '<div class="empty-state"><p>Belum ada aktivitas.</p></div>';
}

function handleReportForm() {
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (!navigator.geolocation) return toast("Perangkat tidak mendukung geolokasi.");
    navigator.geolocation.getCurrentPosition(pos => { setReportLocation(pos.coords.latitude,pos.coords.longitude); toast("Lokasi perangkat berhasil dipilih."); }, () => toast("Izin lokasi ditolak. Klik titik langsung pada peta atau ketik koordinat manual."), { enableHighAccuracy: true, timeout: 8000 });
  });

  const searchCoordinates = () => {
    const parsed = parseCoordinates(document.getElementById("coordinates").value);
    if (!parsed) return toast("Format koordinat tidak valid. Contoh: -7.240000, 112.619500");
    setReportLocation(parsed.lat, parsed.lng, 17);
    toast("Titik koordinat ditemukan dan peta telah dipindahkan.");
  };
  document.getElementById("searchCoordinateBtn").addEventListener("click", searchCoordinates);
  document.getElementById("coordinates").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); searchCoordinates(); } });

  document.querySelectorAll("[data-map-tab]").forEach(button => button.addEventListener("click", () => {
    const showGoogle = button.dataset.mapTab === "google";
    document.querySelectorAll("[data-map-tab]").forEach(tab => { const active = tab === button; tab.classList.toggle("active", active); tab.setAttribute("aria-selected", String(active)); });
    document.getElementById("pickerMapPane").classList.toggle("active", !showGoogle);
    document.getElementById("pickerMapPane").hidden = showGoogle;
    document.getElementById("googleMapPane").classList.toggle("active", showGoogle);
    document.getElementById("googleMapPane").hidden = !showGoogle;
    if (!showGoogle) setTimeout(() => maps.report?.invalidateSize(), 40);
  }));

  const searchGooglePlace = () => {
    const query = document.getElementById("googlePlaceQuery").value.trim();
    if (!query) return toast("Ketik alamat atau nama tempat yang ingin dicari.");
    document.getElementById("googleMapFrame").src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`;
    toast("Tampilan Google Maps diperbarui. Pastikan koordinat laporan juga diisi.");
  };
  document.getElementById("searchGooglePlaceBtn").addEventListener("click", searchGooglePlace);
  document.getElementById("googlePlaceQuery").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); searchGooglePlace(); } });

  document.getElementById("reportForm").addEventListener("submit", event => {
    event.preventDefault();
    const coords = document.getElementById("coordinates").value.split(",").map(Number);
    if (coords.length !== 2 || coords.some(Number.isNaN)) return toast("Pilih lokasi laporan pada peta terlebih dahulu.");
    snapshot("mengirim laporan");
    const id = `GGR-${String(Date.now()).slice(-6)}`;
    const report = {
      id, reporter: document.getElementById("reporterName").value.trim(), phone: document.getElementById("reporterPhone").value.trim(),
      category: document.getElementById("category").value, severity: Number(document.getElementById("severity").value), description: document.getElementById("description").value.trim(),
      village: document.getElementById("village").value, address: document.getElementById("address").value.trim(), lat: coords[0], lng: coords[1],
      status: "Menunggu Verifikasi", technician: "", createdAt: new Date().toISOString()
    };
    reports.push(report); verificationQueue.enqueue(report); addActivity("+", `Laporan ${id} masuk ke antrean verifikasi`); persist(); rebuildStructures(); renderAll();
    event.target.reset(); document.getElementById("coordinates").value = ""; document.getElementById("googleMapLink").classList.add("disabled");
    document.getElementById("googleMapFrame").src = "https://www.google.com/maps?q=-7.2400,112.6195&z=15&output=embed";
    if (mapLayers.reportMarker) { mapLayers.reportMarker.remove(); mapLayers.reportMarker = null; }
    document.getElementById("successId").textContent = id; document.getElementById("reportSuccess").classList.add("show"); document.getElementById("reportSuccess").setAttribute("aria-hidden","false");
  });
  document.querySelectorAll(".modal-close").forEach(b => b.addEventListener("click", closeModal));
  document.querySelector(".modal-close-action").addEventListener("click", () => { closeModal(); showSection("beranda"); });
}
function closeModal() { const modal = document.getElementById("reportSuccess"); modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); }

function renderAdminSummary() {
  const values = [
    ["Menunggu verifikasi", verificationQueue.size()],
    ["Ditugaskan", reports.filter(r => r.status === "Ditugaskan").length],
    ["Dalam perjalanan", reports.filter(r => r.status === "Menuju Lokasi").length],
    ["Selesai", reports.filter(r => r.status === "Selesai").length]
  ];
  document.getElementById("adminSummary").innerHTML = values.map(v => `<article class="summary-card"><span>${v[0]}</span><strong>${v[1]}</strong></article>`).join("");
}

function renderQueue() {
  const waiting = verificationQueue.items;
  document.getElementById("queueCount").textContent = `${waiting.length} item`;
  document.getElementById("queueList").innerHTML = waiting.length ? waiting.map((r,i) => `<button class="queue-item ${selectedAdminId===r.id?"selected":""}" data-report-id="${r.id}"><span class="queue-number">${i+1}</span><span class="queue-main"><strong>${r.id} · ${escapeHTML(r.village)}</strong><small>${escapeHTML(r.category)} · ${formatDate(r.createdAt)}</small></span><span class="priority ${priorityClass(r.severity)}">${priorityLabel(r.severity)}</span></button>`).join("") : '<div class="empty-state"><span>✓</span><h3>Antrean kosong</h3><p>Semua laporan sudah diproses.</p></div>';
  document.querySelectorAll(".queue-item").forEach(item => item.addEventListener("click", () => { selectedAdminId = item.dataset.reportId; renderQueue(); renderAdminDetail(); }));
}

function renderAdminDetail() {
  const target = document.getElementById("adminDetail"); const report = reports.find(r => r.id === selectedAdminId);
  if (!report || report.status !== "Menunggu Verifikasi") { target.className = "empty-state"; target.innerHTML = '<span>⌁</span><h3>Pilih laporan</h3><p>Klik satu laporan dari antrean untuk melihat detail dan menugaskan teknisi.</p>'; return; }
  const isFront = verificationQueue.front()?.id === report.id;
  target.className = "detail-wrap";
  target.innerHTML = `<div class="detail-head"><div><span class="section-kicker">${report.id}</span><h3>${escapeHTML(report.category)}</h3></div><span class="priority ${priorityClass(report.severity)}">Prioritas ${priorityLabel(report.severity)}</span></div>
    <div class="detail-grid"><div class="detail-box"><span>Pelapor</span><strong>${escapeHTML(report.reporter)}</strong></div><div class="detail-box"><span>Kelurahan</span><strong>${escapeHTML(report.village)}</strong></div><div class="detail-box"><span>Alamat</span><strong>${escapeHTML(report.address)}</strong></div><div class="detail-box"><span>Koordinat</span><strong>${report.lat.toFixed(5)}, ${report.lng.toFixed(5)}</strong></div></div>
    <div class="detail-description">${escapeHTML(report.description)}</div>
    <p><a class="map-link" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${report.lat},${report.lng}">Buka lokasi di Google Maps</a></p>
    ${isFront ? "" : '<p class="queue-notice">Laporan ini belum berada di posisi terdepan. Proses queue dilakukan secara FIFO.</p>'}
    <div class="assignment-form"><select id="assignTechnician" ${isFront?"":"disabled"}><option value="">Pilih teknisi...</option>${TECHNICIANS.map(t=>`<option>${t}</option>`).join("")}</select><button id="assignBtn" class="button primary" ${isFront?"":"disabled"}>Verifikasi & tugaskan</button></div>
    <button id="rejectBtn" class="danger-button" style="margin-top:10px" ${isFront?"":"disabled"}>Tolak laporan</button>`;
  document.getElementById("assignBtn").addEventListener("click", () => assignReport(report.id));
  document.getElementById("rejectBtn").addEventListener("click", () => rejectReport(report.id));
}

function assignReport(id) {
  if (verificationQueue.front()?.id !== id) return toast("Proses laporan terdepan terlebih dahulu sesuai aturan FIFO.");
  const technician = document.getElementById("assignTechnician")?.value;
  if (!technician) return toast("Pilih teknisi terlebih dahulu.");
  const report = reports.find(r => r.id === id); if (!report) return;
  snapshot(`menugaskan ${id}`); verificationQueue.dequeue(); report.status = "Ditugaskan"; report.technician = technician; addActivity("→", `${id} ditugaskan kepada ${technician}`); selectedAdminId = null; persist(); rebuildStructures(); renderAll(); toast("Laporan terverifikasi dan teknisi berhasil ditugaskan.");
}
function rejectReport(id) {
  if (verificationQueue.front()?.id !== id) return toast("Proses laporan terdepan terlebih dahulu sesuai aturan FIFO.");
  const report = reports.find(r => r.id === id); if (!report) return;
  snapshot(`menolak ${id}`); verificationQueue.dequeue(); report.status = "Ditolak"; addActivity("×", `${id} ditolak setelah verifikasi`); selectedAdminId = null; persist(); rebuildStructures(); renderAll(); toast("Laporan dipindahkan ke status ditolak.");
}
function processQueueFront() {
  const front = verificationQueue.front();
  if (!front) return toast("Antrean verifikasi sudah kosong.");
  selectedAdminId = front.id; renderQueue(); renderAdminDetail(); toast(`${front.id} adalah laporan terdepan sesuai FIFO.`);
}

function renderReportTable() {
  const query = document.getElementById("adminSearch").value.toLowerCase(); const status = document.getElementById("statusFilter").value;
  const filtered = reports.filter(r => (status === "all" || r.status === status) && [r.id,r.village,r.address,r.category].some(v => String(v).toLowerCase().includes(query)));
  document.getElementById("reportTableBody").innerHTML = filtered.length ? filtered.map(r => `<tr><td><strong>${r.id}</strong></td><td>${escapeHTML(r.village)}<br><small>${escapeHTML(r.address)}</small></td><td>${escapeHTML(r.category)}</td><td><span class="priority ${priorityClass(r.severity)}">${priorityLabel(r.severity)}</span></td><td>${escapeHTML(r.technician || "—")}</td><td><span class="status-pill ${statusClass(r.status)}">${r.status}</span></td></tr>`).join("") : '<tr><td colspan="6">Tidak ada data yang sesuai.</td></tr>';
}

function setupAdmin() {
  document.getElementById("processQueueBtn").addEventListener("click", processQueueFront);
  document.getElementById("adminSearch").addEventListener("input", renderReportTable);
  document.getElementById("statusFilter").addEventListener("change", renderReportTable);
}

function renderTechnician() {
  const select = document.getElementById("activeTechnician");
  if (!select.options.length) select.innerHTML = TECHNICIANS.map(t => `<option>${t}</option>`).join("");
  const technician = select.value || TECHNICIANS[0]; const tasks = reports.filter(r => r.technician === technician && ["Ditugaskan","Menuju Lokasi"].includes(r.status));
  document.getElementById("taskCount").textContent = `${tasks.length} tugas`;
  document.getElementById("taskList").innerHTML = tasks.length ? tasks.sort((a,b)=>b.severity-a.severity).map((r,i)=>`<article class="task-card"><div class="task-card-head"><div><span class="section-kicker">Rute ${i+1} · ${r.id}</span><h3>${escapeHTML(r.village)} — ${escapeHTML(r.category)}</h3></div><span class="priority ${priorityClass(r.severity)}">${priorityLabel(r.severity)}</span></div><p>${escapeHTML(r.address)}<br>Status: ${r.status}</p><div class="task-actions">${r.status==="Ditugaskan"?`<button data-task-action="start" data-id="${r.id}">Mulai perjalanan</button>`:""}<button class="complete" data-task-action="complete" data-id="${r.id}">Tandai selesai</button></div></article>`).join("") : '<div class="empty-state"><span>✓</span><h3>Tidak ada tugas aktif</h3><p>Pilih teknisi lain atau tunggu penugasan admin.</p></div>';
  document.querySelectorAll("[data-task-action]").forEach(button => button.addEventListener("click", () => updateTask(button.dataset.id, button.dataset.taskAction)));
  calculateRoute(tasks);
}

function updateTask(id, action) {
  const report = reports.find(r => r.id === id); if (!report) return;
  snapshot(`${action === "start" ? "memulai" : "menyelesaikan"} ${id}`);
  report.status = action === "start" ? "Menuju Lokasi" : "Selesai";
  addActivity(action === "start" ? "↗" : "✓", `${report.technician} ${action === "start" ? "menuju lokasi" : "menyelesaikan"} ${id}`);
  persist(); rebuildStructures(); renderAll(); toast(action === "start" ? "Status diperbarui: menuju lokasi." : "Laporan ditandai selesai.");
}

function calculateRoute(tasks = null) {
  const technician = document.getElementById("activeTechnician").value || TECHNICIANS[0];
  tasks = tasks || reports.filter(r => r.technician === technician && ["Ditugaskan","Menuju Lokasi"].includes(r.status));
  const ordered = [...tasks].sort((a,b) => b.severity - a.severity || regionGraph.shortestPath("Depot Pakal",a.village).distance - regionGraph.shortestPath("Depot Pakal",b.village).distance);
  let total = 0; let from = "Depot Pakal"; const stops = [from];
  ordered.forEach(report => { const segment = regionGraph.shortestPath(from, report.village); total += Number.isFinite(segment.distance) ? segment.distance : 0; from = report.village; stops.push(report.village); });
  document.getElementById("routeSummary").innerHTML = ordered.length ? `<div class="route-steps">${stops.map((s,i)=>`${i?'<span class="route-arrow">›</span>':''}<span class="route-step">${escapeHTML(s)}</span>`).join("")}</div><small>Estimasi bobot graph: ${total.toFixed(1)} km · Urutan: prioritas lalu jarak terpendek</small>` : '<p>Belum ada rute karena teknisi tidak memiliki tugas aktif.</p>';
  renderRouteMap(ordered);
}

function renderRouteMap(tasks) {
  if (!maps.route) return;
  mapLayers.route.forEach(layer => layer.remove()); mapLayers.route = [];
  const points = [LOCATIONS["Depot Pakal"]];
  const depot = L.marker(LOCATIONS["Depot Pakal"], { icon: markerIcon("Selesai") }).addTo(maps.route).bindPopup("Depot teknisi"); mapLayers.route.push(depot);
  tasks.forEach(report => { points.push([report.lat,report.lng]); const marker=L.marker([report.lat,report.lng],{icon:markerIcon(report.status)}).addTo(maps.route).bindPopup(`<strong>${report.id}</strong><br>${escapeHTML(report.address)}`); mapLayers.route.push(marker); });
  if (points.length > 1) { const line=L.polyline(points,{color:"#5552d9",weight:4,dashArray:"8 8"}).addTo(maps.route); mapLayers.route.push(line); maps.route.fitBounds(L.latLngBounds(points).pad(.25)); }
  else maps.route.setView(LOCATIONS["Depot Pakal"],14);
}

function setupTechnician() {
  document.getElementById("activeTechnician").addEventListener("change", renderTechnician);
  document.getElementById("calculateRouteBtn").addEventListener("click", () => { calculateRoute(); toast("Rute dihitung ulang menggunakan graph wilayah."); });
}

function renderStructures() {
  document.getElementById("stackVisual").innerHTML = actionStack.items.length ? actionStack.items.slice(-5).map((x,i)=>`<div class="stack-block">${i===Math.min(actionStack.size(),5)-1?"TOP · ":""}${escapeHTML(x.action)}</div>`).join("") : '<div class="map-fallback">Stack kosong.<br>Lakukan aksi untuk mengisinya.</div>';
  document.getElementById("queueVisual").innerHTML = verificationQueue.items.length ? verificationQueue.items.slice(0,6).map((r,i)=>`<div class="queue-block">${i===0?"FRONT<br>":""}${r.id}</div>`).join("") : '<div class="map-fallback">Queue kosong</div>';
  const linked = reportList.toArray().slice(0,5);
  document.getElementById("linkedVisual").innerHTML = linked.map((r,i)=>`${i?'<span class="link-arrow">→</span>':''}<span class="linked-node">${r.id}</span>`).join("") + (reportList.length>5?'<span class="link-arrow">→ …</span>':'');
  const treeRows = traverseRecursive(regionTree).slice(0,12);
  document.getElementById("treeVisual").innerHTML = treeRows.map(r=>`<div class="tree-line depth-${r.depth}">${r.depth?"└ ":""}${escapeHTML(r.name)}</div>`).join("");
  renderGraphVisual(); updateUndo();
}

function renderGraphVisual() {
  const positions = { "Depot Pakal":[8,41], "Babat Jerawat":[38,12], "Pakal":[42,45], "Benowo":[72,72], "Sumber Rejo":[73,10] };
  const view = document.getElementById("graphVisual"); const w=100,h=100;
  const edges=[]; const seen=new Set();
  Object.entries(regionGraph.adjacency).forEach(([a,list])=>list.forEach(({node:b})=>{const key=[a,b].sort().join("|");if(!seen.has(key)){seen.add(key);edges.push([a,b]);}}));
  view.innerHTML = `<svg class="edge-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${edges.map(([a,b])=>`<line x1="${positions[a][0]+7}" y1="${positions[a][1]+6}" x2="${positions[b][0]+7}" y2="${positions[b][1]+6}"/>`).join("")}</svg>` + Object.entries(positions).map(([name,[x,y]])=>`<span class="graph-node ${name.startsWith("Depot")?"depot":""}" style="left:${x}%;top:${y}%">${name}</span>`).join("");
}

function setupStructures() {
  document.getElementById("stackPopBtn").addEventListener("click", undo);
  document.getElementById("linkedSearchBtn").addEventListener("click", () => {
    const id=document.getElementById("linkedSearch").value.trim().toLowerCase(); const result=reportList.find(r=>r.id.toLowerCase()===id); document.getElementById("linkedSearchResult").textContent=result?`Ditemukan: ${result.id} · ${result.village} · ${result.status}`:"Data tidak ditemukan pada linked list.";
  });
  document.getElementById("traverseBtn").addEventListener("click", () => {
    const rows=traverseRecursive(regionTree); document.getElementById("recursiveLog").innerHTML=rows.map(r=>`<p>${"· ".repeat(r.depth)}${escapeHTML(r.name)} <span style="opacity:.55">[${r.type}]</span></p>`).join(""); toast(`${rows.length} node berhasil ditelusuri secara rekursif.`);
  });
  document.getElementById("shortestPathBtn").addEventListener("click", () => {
    const from=document.getElementById("graphFrom").value; const to=document.getElementById("graphTo").value; const result=regionGraph.shortestPath(from,to); document.getElementById("graphResult").textContent=result.path.length?`${result.path.join(" → ")} · bobot ${result.distance.toFixed(1)} km`:"Jalur tidak ditemukan.";
  });
  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    snapshot("memuat ulang data contoh"); reports=structuredClone(sampleReports); activities=structuredClone(sampleActivities); persist(); rebuildStructures(); renderAll(); toast("Data contoh berhasil dimuat ulang.");
  });
}

function updateUndo() { document.getElementById("undoBtn").disabled = actionStack.isEmpty(); }
function toast(message) { const el=document.getElementById("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2800); }

function renderAll() {
  renderStats(); renderActivities(); renderOverviewMap(); renderAdminSummary(); renderQueue(); renderAdminDetail(); renderReportTable(); renderTechnician(); renderStructures();
}

document.addEventListener("DOMContentLoaded", () => {
  rebuildStructures(); setupNavigation(); initializeMaps(); handleReportForm(); setupAdmin(); setupTechnician(); setupStructures();
  document.getElementById("undoBtn").addEventListener("click", undo);
  renderAll();
});
