import { DEMO_USERS, redirectFor, toast } from "./common.js";
import { login, currentUser } from "./auth-service.js";
import { firebaseEnabled } from "./firebase-service.js";

const form=document.getElementById("loginForm"),submit=document.getElementById("submitBtn");
document.getElementById("modeBanner").innerHTML=firebaseEnabled?'<b>Firebase aktif</b><span>Authentication dan Firestore terhubung.</span>':'<b>Mode demo lokal</b><span>Masukkan konfigurasi Firebase untuk mode online.</span>';
document.querySelector(".password-toggle").addEventListener("click",e=>{const input=document.getElementById("password"),show=input.type==="password";input.type=show?"text":"password";e.currentTarget.textContent=show?"Tutup":"Lihat";});
document.querySelectorAll("[data-demo]").forEach(btn=>btn.addEventListener("click",()=>{const u=DEMO_USERS.find(x=>x.role===btn.dataset.demo);document.getElementById("email").value=u.email;document.getElementById("password").value=u.password;toast(`Akun demo ${btn.textContent} siap digunakan.`);}));
form.addEventListener("submit",async e=>{e.preventDefault();submit.disabled=true;submit.textContent="Memeriksa akun...";try{const user=await login(document.getElementById("email").value,document.getElementById("password").value);redirectFor(user.role);}catch(err){toast(err.message||"Login gagal. Silakan coba lagi.");submit.disabled=false;submit.textContent="Masuk";}});
currentUser().then(user=>{if(user)redirectFor(user.role);});
const reason=new URLSearchParams(location.search).get("reason");if(reason==="login")toast("Silakan login untuk membuka portal.");
