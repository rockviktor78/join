let tasks = [];

let currentDraggedElement;
let BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

async function initBoard() {
    await fetchTasks();
    console.log(tasks);
    updateHTML();
}

async function fetchTasks(path = "tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    const data = await response.json();

    tasks = Object.keys(data).map((key, index) => ({
        id: index,
        ...data[key]
    }));
    console.log(tasks);

}

function updateHTML() {
    sortTodo();
    sortInprogress();
    sortAwaitfeedback();
    sortDone();
}

function sortTodo() {
    let todo = tasks.filter(t => t['category'] == 'to do');
    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += generateTodoHTML(element);
    }
}

function sortInprogress() {
    let inprogress = tasks.filter(t => t['category'] == 'in progress');
    document.getElementById('inprogress').innerHTML = '';

    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById('inprogress').innerHTML += generateTodoHTML(element);
    }
}

function sortAwaitfeedback() {
    let awaitfeedback = tasks.filter(t => t['category'] == 'await feedback');
    document.getElementById('awaitfeedback').innerHTML = '';

    for (let index = 0; index < awaitfeedback.length; index++) {
        const element = awaitfeedback[index];
        document.getElementById('awaitfeedback').innerHTML += generateTodoHTML(element);
    }
}

function sortDone() {
    let done = tasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo-card">
            <div></div>
            <div class="todo-card-title">${element['title']}</div>
            <div class="todo-card-description">${element['description']}</div>
            <div class="todo-card-subtastks">${element['subtasks']}</div>
            <div class="todo-card-assignedto">${element['assignedTo']}</div>
            <div class="todo-card-priority">${element['priority']}</div>
        </div>
    `;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    tasks[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}