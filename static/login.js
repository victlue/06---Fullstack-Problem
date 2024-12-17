
const loginForm = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorMessageEl = document.getElementById('error-message');
const messageEl = document.getElementById('message');
const BASE_URL = 'http://127.0.0.1:5000';

// TODO: Implement a function loadTasks() that fetches /tasks and displays them
// TODO: Implement event listener on newTaskForm to POST a new task
// TODO: Implement a function to handle 'mark as completed' button clicks (PATCH request)


async function attempt_login(username, password) {
    // TODO: POST /tasks with {description}, then reload tasks
    let url=BASE_URL+'/login';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    });

    const response_data = await resp.json();

    if (resp.ok){
        messageEl.innerHTML="<p>Update successful</p>";
        if (response_data.redirect) {
            window.location.href = response_data.redirect;
        }
        // await loadTasks();
    }
    else{
        errorMessageEl.innerHTML=`<p>Error: Failed login attempt</p>`;
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user_input = username.value.trim();
    const pass_input = password.value.trim();
    console.log(user_input)
    console.log(pass_input)
    if (user_input && pass_input) {
        await attempt_login(user_input, pass_input);
    }
});

// document.addEventListener('DOMContentLoaded', loadTasks);