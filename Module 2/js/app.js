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
// Module 2 - Study Task Management
const TASK_KEY = "psp_tasks";
let tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];
let taskFilter = "all";
const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));

function saveTasks() {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

function subjectOptions(selected = "") {
    const select = document.getElementById("taskSubject");
    select.innerHTML = '<option value="">Select subject</option>';
    subjects.forEach(s => {
        const option = document.createElement("option");
        option.value = s.id;
        option.textContent = s.name;
        if (String(s.id) === String(selected)) option.selected = true;
        select.appendChild(option);
    });
}

document.getElementById("addTaskBtn").onclick = () => {
    document.getElementById("taskForm").reset();
    document.getElementById("taskId").value = "";
    document.getElementById("taskStatus").value = "pending";
    document.getElementById("taskModalTitle").textContent = "Add Study Task";
    subjectOptions();
    taskModal.show();
};

document.getElementById("taskForm").onsubmit = e => {
    e.preventDefault();

    const id = document.getElementById("taskId").value;
    const title = document.getElementById("taskTitle").value.trim();
    const subjectId = document.getElementById("taskSubject").value;
    const deadline = document.getElementById("taskDeadline").value;
    const status = document.getElementById("taskStatus").value;

    if (!title || !subjectId || !deadline) return;

    const subject = subjects.find(s => String(s.id) === String(subjectId));
    const data = {
        id: id || Date.now().toString(),
        title,
        subjectId,
        subjectName: subject ? subject.name : "Subject",
        deadline,
        status
    };

    if (id) {
        tasks = tasks.map(t => t.id === id ? data : t);
    } else {
        tasks.push(data);
    }

    saveTasks();
    renderTasks();
    taskModal.hide();
};

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("taskId").value = task.id;
    document.getElementById("taskTitle").value = task.title;
    subjectOptions(task.subjectId);
    document.getElementById("taskDeadline").value = task.deadline;
    document.getElementById("taskStatus").value = task.status;
    document.getElementById("taskModalTitle").textContent = "Edit Study Task";
    taskModal.show();
}

function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task && confirm(`Delete "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) t.status = t.status === "completed" ? "pending" : "completed";
        return t;
    });
    saveTasks();
    renderTasks();
}

document.querySelectorAll(".task-filter").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".task-filter").forEach(b => {
            b.classList.remove("active", "btn-primary");
            b.classList.add("btn-outline-primary");
        });
        button.classList.add("active", "btn-primary");
        button.classList.remove("btn-outline-primary");
        taskFilter = button.dataset.filter;
        renderTasks();
    };
});

function renderTasks() {
    const grid = document.getElementById("taskGrid");
    const empty = document.getElementById("taskEmpty");

    document.getElementById("taskCount").textContent = tasks.length;
    document.getElementById("pendingCount").textContent = tasks.filter(t => t.status === "pending").length;
    document.getElementById("completedCount").textContent = tasks.filter(t => t.status === "completed").length;

    let list = tasks;
    if (taskFilter === "pending") list = tasks.filter(t => t.status === "pending");
    if (taskFilter === "completed") list = tasks.filter(t => t.status === "completed");

    list = [...list].sort((a, b) => a.deadline.localeCompare(b.deadline));
    empty.classList.toggle("d-none", list.length > 0);
    grid.innerHTML = "";

    list.forEach(t => {
        grid.innerHTML += `
        <div class="col-md-6 col-lg-4">
            <article class="task ${t.status === "completed" ? "completed" : ""}">
                <div class="task-body">
                    <div class="d-flex justify-content-between gap-2 align-items-start">
                        <h5 class="fw-bold mb-1">${esc(t.title)}</h5>
                        <span class="task-status ${t.status}">${t.status === "completed" ? "Completed" : "Pending"}</span>
                    </div>
                    <p class="text-secondary small mb-2">📚 ${esc(t.subjectName)}</p>
                    <div class="task-date mb-3">📅 Deadline: ${formatTaskDate(t.deadline)}</div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm ${t.status === "completed" ? "btn-warning" : "btn-success"}" onclick="toggleTask('${t.id}')">
                            ${t.status === "completed" ? "Mark Pending" : "Mark Complete"}
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="editTask('${t.id}')">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTask('${t.id}')">Delete</button>
                    </div>
                </div>
            </article>
        </div>`;
    });
}

function formatTaskDate(value) {
    return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
        day: "2-digit", month: "short", year: "numeric"
    });
}

renderTasks();
