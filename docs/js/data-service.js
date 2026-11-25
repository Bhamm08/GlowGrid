import { SAMPLE_REPORTS, DEMO_USERS } from "./common.js";
import { firebaseEnabled, getFirebase } from "./firebase-service.js";

const REPORT_KEY="glowgrid_reports_v2";
function loadLocal(){try{const v=JSON.parse(localStorage.getItem(REPORT_KEY));if(Array.isArray(v))return v;}catch{}const seed=structuredClone(SAMPLE_REPORTS);localStorage.setItem(REPORT_KEY,JSON.stringify(seed));return seed;}
function saveLocal(v){localStorage.setItem(REPORT_KEY,JSON.stringify(v));}
function normalize(doc){const data=doc.data();return{id:doc.id,...data};}

export async function listReports(user){
  if(!firebaseEnabled){const all=loadLocal();return user.role==="admin"?all:user.role==="teknisi"?all.filter(r=>r.technicianId===user.uid):all.filter(r=>r.ownerId===user.uid);}
  const {db,dbMod}=await getFirebase(); const ref=dbMod.collection(db,"reports"); let q;
  if(user.role==="admin") q=dbMod.query(ref,dbMod.orderBy("createdAt","desc"));
  else if(user.role==="teknisi") q=dbMod.query(ref,dbMod.where("technicianId","==",user.uid));
  else q=dbMod.query(ref,dbMod.where("ownerId","==",user.uid));
  const snap=await dbMod.getDocs(q);return snap.docs.map(normalize);
}

export async function createReport(user,payload){
  const id=`GGR-${String(Date.now()).slice(-6)}`; const report={...payload,ownerId:user.uid,reporter:user.name,phone:user.phone||payload.phone,status:"Menunggu Verifikasi",technicianId:"",technicianName:"",createdAt:new Date().toISOString()};
  if(!firebaseEnabled){const all=loadLocal();all.push({id,...report});saveLocal(all);return{id,...report};}
  const {db,dbMod}=await getFirebase();await dbMod.setDoc(dbMod.doc(db,"reports",id),{...report,createdAt:dbMod.serverTimestamp(),updatedAt:dbMod.serverTimestamp()});return{id,...report};
}

export async function updateReport(id,changes){
  if(!firebaseEnabled){const all=loadLocal(),i=all.findIndex(r=>r.id===id);if(i<0)throw new Error("Laporan tidak ditemukan.");all[i]={...all[i],...changes,updatedAt:new Date().toISOString()};saveLocal(all);return all[i];}
  const {db,dbMod}=await getFirebase();await dbMod.updateDoc(dbMod.doc(db,"reports",id),{...changes,updatedAt:dbMod.serverTimestamp()});return{id,...changes};
}

export async function listTechnicians(){
  if(!firebaseEnabled)return DEMO_USERS.filter(x=>x.role==="teknisi").map(({uid,name,email})=>({uid,name,email}));
  const {db,dbMod}=await getFirebase();const snap=await dbMod.getDocs(dbMod.query(dbMod.collection(db,"users"),dbMod.where("role","==","teknisi")));return snap.docs.map(d=>({uid:d.id,...d.data()}));
}
