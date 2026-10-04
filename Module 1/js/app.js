const KEY="psp_subjects";
let subjects=JSON.parse(localStorage.getItem(KEY))||[
{id:"1",name:"Web Development",code:"WD-101",color:"#0d6efd",notes:"Frontend development and UI practice."},
{id:"2",name:"Programming",code:"CS-102",color:"#6f42c1",notes:"Practice programming concepts."}
];
const modal=new bootstrap.Modal(document.getElementById("modal"));
const form=document.getElementById("form");
const subjectId=document.getElementById("id");
const subjectName=document.getElementById("name");
const subjectCode=document.getElementById("code");
const subjectColor=document.getElementById("color");
const subjectNotes=document.getElementById("notes");
const modalTitle=document.getElementById("modalTitle");
function save(){localStorage.setItem(KEY,JSON.stringify(subjects))}
function esc(v){return String(v).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[x]))}
function render(){
document.getElementById("count").textContent=subjects.length;
document.getElementById("heroCount").textContent=subjects.length;
document.getElementById("empty").classList.toggle("d-none",subjects.length>0);
const grid=document.getElementById("grid"); grid.innerHTML="";
subjects.forEach(s=>{grid.innerHTML+=`<div class="col-md-6 col-lg-4"><article class="subject"><div class="accent" style="background:${s.color}"></div><div class="subject-body"><div class="code">${esc(s.code||"No code")}</div><h4 class="fw-bold mt-2">${esc(s.name)}</h4><p class="text-secondary small">${esc(s.notes||"No notes added.")}</p><div class="d-flex gap-2"><button class="btn btn-outline-secondary btn-sm flex-fill" onclick="view('${s.id}')">View</button><button class="btn btn-outline-primary btn-sm" onclick="edit('${s.id}')">Edit</button><button class="btn btn-outline-danger btn-sm" onclick="del('${s.id}')">Delete</button></div></div></article></div>`})
}
document.getElementById("addBtn").onclick=()=>{form.reset();subjectId.value="";subjectColor.value="#0d6efd";modalTitle.textContent="Add Subject";modal.show()};
form.onsubmit=e=>{e.preventDefault();let data={id:subjectId.value||Date.now().toString(),name:subjectName.value.trim(),code:subjectCode.value.trim(),color:subjectColor.value,notes:subjectNotes.value.trim()};if(!data.name)return;if(subjectId.value)subjects=subjects.map(s=>s.id===subjectId.value?data:s);else subjects.push(data);save();render();modal.hide()};
function edit(x){let s=subjects.find(a=>a.id===x);subjectId.value=s.id;subjectName.value=s.name;subjectCode.value=s.code;subjectColor.value=s.color;subjectNotes.value=s.notes;modalTitle.textContent="Edit Subject";modal.show()}
function view(x){let s=subjects.find(a=>a.id===x);alert(`Subject: ${s.name}\nCode: ${s.code||"Not added"}\nNotes: ${s.notes||"No notes added."}`)}
function del(x){let s=subjects.find(a=>a.id===x);if(confirm(`Delete "${s.name}"?`)){subjects=subjects.filter(a=>a.id!==x);save();render()}}
render();