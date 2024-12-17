const taskListEl = document.getElementById('task-list');
const newTaskForm = document.getElementById('new-task-form');
const newTaskDesc = document.getElementById('new-task-desc');
const errorMessageEl = document.getElementById('error-message');
const messageEl = document.getElementById('message');
const BASE_URL = 'http://127.0.0.1:5000';

// TODO: Implement a function loadTasks() that fetches /tasks and displays them
// TODO: Implement event listener on newTaskForm to POST a new task
// TODO: Implement a function to handle 'mark as completed' button clicks (PATCH request)

async function loadTasks() {
    // TODO: fetch('/tasks'), parse JSON, and update the DOM
    let url=BASE_URL+'/tasks';
    const resp=await fetch(url);
    const tasks = await resp.json();

    if (!tasks.length){
        errorMessageEl.innerHTML=`<p>Error: no items found</p>`;
        return;
    }
    else{
        errorMessageEl.innerHTML=``;
    }

    let html="<table><tr><th>id</th><th>description</th><th>status</th></tr>"
    for (const task of tasks){
        html += `<tr>
        <td>${task.id}</td>
        <td>${task.description}</td>
        <td>${task.completed}</td>
        </tr>`
    }
    html +="</table>";
    taskListEl.innerHTML=html;
}

async function addTask(description) {
    // TODO: POST /tasks with {description}, then reload tasks
    let url=BASE_URL+'/tasks';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({description: description})
    });

    if (resp.ok){
        messageEl.innerHTML="<p>Update successful</p>";
        await loadTasks();
    }
    else{
        errorMessageEl.innerHTML=`<p>Error: Failed to save name update -- addTask</p>`;
    }
}

async function logOut(){
    let url=BASE_URL+'/logout';
    const resp=await fetch(url,{
        method: 'POST'
    });
    const response_data = await resp.json();

    if (resp.ok){
        window.location.href="/";
    }
    else{
        errorMessageEl.innerHTML=`<p>Error: Logout failed</p>`;
    }
}

async function completeTask(id) {
    const resp=await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PATCH'
    })

    if (resp.ok){
        messageEl.innerHTML="<p>Update successful</p>";
        await loadTasks();
    }
    else{
        errorMessageEl.innerHTML=`<p>Error: Failed to save status update</p>`;
    }
    // TODO: PATCH /tasks/<id> to mark completed, then reload tasks
}

newTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const desc = newTaskDesc.value.trim();
    if (desc) {
        await addTask(desc);
        newTaskDesc.value = '';
    }
});

document.addEventListener('DOMContentLoaded', loadTasks);