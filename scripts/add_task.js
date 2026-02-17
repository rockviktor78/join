let task = []

const dateInput = document.getElementById('task-due-date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// 🔹 Format dd/mm/yyyy anzeigen
dateInput.addEventListener('change', () => {
    const date = new Date(dateInput.value);
    if (!isNaN(date)) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        dateInput.setAttribute('data-date', `${day}/${month}/${year}`);
    }
});

// 🔹 Kalender per Icon öffnen
function openDatePicker() {
    dateInput.showPicker();
}

function selectPriority(priority) {
    task.priority = priority.value 
    document.querySelectorAll('.priority').forEach(el => el.classList.remove('selected'))
    priority.classList.add('selected')
}

function selectPriority(button) {
    const buttons = document.querySelectorAll('.priority__button');
    buttons.forEach(btn => {
        btn.classList.remove('urgent', 'medium', 'low', 'active');
        const img = btn.querySelector('img');
        const base = btn.value;
        img.src = `../assets/img/addtask/${base}.svg`;
    });
    const priority = button.value;
    button.classList.add(priority, 'active');
    const img = button.querySelector('img');
    img.src = `../assets/img/addtask/${priority}selected.svg`;
}

function saveTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const assignedTo = document.getElementById('task-assigned-to').value;
    const category = document.getElementById('task-category').value;
    const subtasks = document.getElementById('task-subtasks').value;
}