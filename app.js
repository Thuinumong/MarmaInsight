import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);
const $=id=>document.getElementById(id);
let currentUser=null, isAdmin=false, items=[];
const sections={culture:"cultureGrid",history:"historyGrid",stories:"storiesGrid",events:"eventsGrid",news:"newsGrid",community:"communityGrid"};
$("year").textContent=new Date().getFullYear();
$("menuBtn").onclick=()=>$("nav").classList.toggle("open");
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>$("nav").classList.remove("open"));
$("loginBtn").onclick=()=>$("authDialog").showModal();
$("logoutBtn").onclick=()=>signOut(auth);
$("newPostBtn").onclick=()=>{if(!currentUser){$("authDialog").showModal();return}$("postDialog").showModal()};
$("googleLogin").onclick=async()=>{try{const provider=new GoogleAuthProvider();await signInWithPopup(auth,provider);$("authDialog").close()}catch(e){$("authStatus").textContent=e.message}};
$("emailLogin").onclick=async()=>{try{const e=$("email").value.trim(),p=$("password").value;if(!e||p.length<6)throw Error("Valid email and password (at least 6 characters) required.");try{await signInWithEmailAndPassword(auth,e,p)}catch(err){if(err.code==="auth/invalid-credential"||err.code==="auth/user-not-found")await createUserWithEmailAndPassword(auth,e,p);else throw err}$("authDialog").close()}catch(e){$("authStatus").textContent=e.message}};
onAuthStateChanged(auth,async user=>{currentUser=user;$("userLabel").textContent=user?.email||"Guest";$("loginBtn").classList.toggle("hidden",!!user);$("logoutBtn").classList.toggle("hidden",!user);isAdmin=false;if(user){const token=await user.getIdTokenResult(true);isAdmin=token.claims.admin===true}$("adminPanel").classList.toggle("hidden",!isAdmin);$("newPostBtn").classList.toggle("hidden",!user);renderManage()});
const q=query(collection(db,"content"),orderBy("createdAt","desc"));
onSnapshot(q,snap=>{items=snap.docs.map(d=>({id:d.id,...d.data()}));render();renderManage()},err=>console.error(err));
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function card(x){return `<article class="contentCard">${x.image?`<img src="${escapeHtml(x.image)}" alt="">`:""}<div class="cardText"><h3>${escapeHtml(x.title||"Untitled")}</h3><p>${escapeHtml(x.body||"")}</p></div></article>`}
function render(){for(const [type,id] of Object.entries(sections)){const data=items.filter(x=>x.type===type);$(id).innerHTML=data.length?data.map(card).join(""):'<div class="empty">No content published yet.</div>'}}
async function publish(type,title,body,image){if(!currentUser)throw Error("Please sign in first.");await addDoc(collection(db,"content"),{type,title,body,image,author:currentUser.uid,authorEmail:currentUser.email,createdAt:serverTimestamp()})}
$("publishBtn").onclick=async()=>{try{if(!isAdmin)throw Error("Admin access required.");await publish($("contentType").value,$("contentTitle").value.trim(),$("contentBody").value.trim(),$("contentImage").value.trim());$("contentTitle").value=$("contentBody").value=$("contentImage").value="";$("adminStatus").textContent="Published successfully."}catch(e){$("adminStatus").textContent=e.message}};
$("submitPost").onclick=async()=>{try{await publish("community",$("postTitle").value.trim(),$("postBody").value.trim(),"");$("postDialog").close();$("postTitle").value=$("postBody").value="";$("postStatus").textContent="Post submitted."}catch(e){$("postStatus").textContent=e.message}};
function renderManage(){if(!isAdmin){$("manageList").innerHTML="";return}const data=items;$("manageList").innerHTML=data.map(x=>`<div class="manageRow"><span><b>${escapeHtml(x.title)}</b> · ${escapeHtml(x.type)}</span><span><button data-edit="${x.id}">Edit</button> <button class="delete" data-delete="${x.id}">Delete</button></span></div>`).join("")||'<p class="muted">No content to manage.</p>';document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=async()=>{const x=items.find(i=>i.id===b.dataset.edit);const title=prompt("Edit title:",x.title||"");if(title===null)return;const body=prompt("Edit description:",x.body||"");if(body===null)return;try{await updateDoc(doc(db,"content",x.id),{title:title.trim(),body:body.trim()});}catch(e){alert(e.message)}});document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this content?"))await deleteDoc(doc(db,"content",b.dataset.delete))})}
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(console.warn);