import { firebaseConfig, firebaseEnabled } from "./firebase-config.js";

let cache=null;
export async function getFirebase() {
  if(!firebaseEnabled) return null;
  if(cache) return cache;
  const [appMod,authMod,dbMod]=await Promise.all([
    import("https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js")
  ]);
  const app=appMod.getApps().length?appMod.getApp():appMod.initializeApp(firebaseConfig);
  cache={app,auth:authMod.getAuth(app),db:dbMod.getFirestore(app),authMod,dbMod};
  return cache;
}

export { firebaseEnabled };
