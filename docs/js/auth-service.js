import { DEMO_USERS } from "./common.js";
import { firebaseEnabled, getFirebase } from "./firebase-service.js";

const SESSION_KEY="glowgrid_session_v2";
const EXTRA_USERS_KEY="glowgrid_demo_users_v2";

function demoUsers() { try{return [...DEMO_USERS,...JSON.parse(localStorage.getItem(EXTRA_USERS_KEY)||"[]")];}catch{return [...DEMO_USERS];} }
function saveSession(user) { const safe={uid:user.uid,name:user.name,email:user.email,role:user.role,phone:user.phone||""}; sessionStorage.setItem(SESSION_KEY,JSON.stringify(safe)); return safe; }
function cachedSession() { try{return JSON.parse(sessionStorage.getItem(SESSION_KEY));}catch{return null;} }

export async function login(email,password) {
  if(!firebaseEnabled) {
    const user=demoUsers().find(x=>x.email.toLowerCase()===email.trim().toLowerCase()&&x.password===password);
    if(!user) throw new Error("Email atau kata sandi tidak cocok.");
    return saveSession(user);
  }
  const {auth,db,authMod,dbMod}=await getFirebase();
  const credential=await authMod.signInWithEmailAndPassword(auth,email.trim(),password);
  const snap=await dbMod.getDoc(dbMod.doc(db,"users",credential.user.uid));
  if(!snap.exists()) { await authMod.signOut(auth); throw new Error("Profil pengguna belum tersedia di Firestore."); }
  const profile={uid:credential.user.uid,email:credential.user.email,...snap.data()};
  if(!["warga","admin","teknisi"].includes(profile.role)) { await authMod.signOut(auth); throw new Error("Role akun tidak valid."); }
  return saveSession(profile);
}

export async function register({name,email,phone,password}) {
  if(!firebaseEnabled) {
    const users=demoUsers(); if(users.some(x=>x.email.toLowerCase()===email.trim().toLowerCase())) throw new Error("Email sudah terdaftar.");
    const user={uid:`demo-${Date.now()}`,name:name.trim(),email:email.trim().toLowerCase(),phone:phone.trim(),password,role:"warga"};
    const extra=JSON.parse(localStorage.getItem(EXTRA_USERS_KEY)||"[]"); extra.push(user); localStorage.setItem(EXTRA_USERS_KEY,JSON.stringify(extra)); return saveSession(user);
  }
  const {auth,db,authMod,dbMod}=await getFirebase();
  const credential=await authMod.createUserWithEmailAndPassword(auth,email.trim(),password);
  const profile={name:name.trim(),email:email.trim().toLowerCase(),phone:phone.trim(),role:"warga",createdAt:dbMod.serverTimestamp()};
  await dbMod.setDoc(dbMod.doc(db,"users",credential.user.uid),profile);
  return saveSession({uid:credential.user.uid,...profile});
}

export async function currentUser() {
  if(!firebaseEnabled) return cachedSession();
  const {auth,db,authMod,dbMod}=await getFirebase();
  const account=await new Promise(resolve=>{const stop=authMod.onAuthStateChanged(auth,u=>{stop();resolve(u);});});
  if(!account) { sessionStorage.removeItem(SESSION_KEY); return null; }
  const snap=await dbMod.getDoc(dbMod.doc(db,"users",account.uid)); if(!snap.exists()) return null;
  return saveSession({uid:account.uid,email:account.email,...snap.data()});
}

export async function requireRole(required) {
  const user=await currentUser();
  if(!user) { location.replace(`index.html?reason=login&next=${required}`); return null; }
  if(user.role!==required) { location.replace(`${user.role==="admin"?"admin":user.role==="teknisi"?"teknisi":"warga"}.html?reason=forbidden`); return null; }
  return user;
}

export async function logout() { if(firebaseEnabled){const {auth,authMod}=await getFirebase();await authMod.signOut(auth);} sessionStorage.removeItem(SESSION_KEY); location.replace("index.html"); }
