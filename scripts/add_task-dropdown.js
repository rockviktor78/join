const selectedContacts = new Map();

/**
 * DROPDOWN INITIALISIERUNG
 */
function initDropdown() {
  const contacts = loadContactsFromSession();
  const list = document.getElementById('dropdown-list');
  if (!list) return;
  list.innerHTML = '';
  contacts.forEach(contact => list.appendChild(createContactItem(contact)));
  updateSearchPlaceholder();
}

function loadContactsFromSession() {
  const rawData = sessionStorage.getItem('joinData');
  const data = rawData ? JSON.parse(rawData) : { contacts: {} };
  const contactsArray = Object.entries(data.contacts).map(([id, c]) => ({ id, ...c }));
  return typeof assignContactColors === 'function' ? assignContactColors(contactsArray) : contactsArray;
}

function createContactItem(contact) {
  const li = document.createElement('li');
  const initial = getInitial(contact.name);
  const color = contact.color || "#D1D1D1";
  li.innerHTML = templateContact(initial, contact.name, color);
  li.addEventListener('click', (e) => handleContactClick(e, li, contact));
  return li;
}

/**
 * DROPDOWN STEUERUNG
 */
function toggleDropdown(e) {
  if (e) e.stopPropagation();
  const list = document.getElementById('dropdown-list');
  const arrow = document.getElementById('dropdown-arrow');
  const isVisible = list?.style.display === 'block';
  if (list) list.style.display = isVisible ? 'none' : 'block';
  if (arrow) arrow.classList.toggle('rotated', !isVisible);
}

function openDropdown(e) {
  if (e) e.stopPropagation();
  document.getElementById('dropdown-list').style.display = 'block';
  document.getElementById('dropdown-arrow')?.classList.add('rotated');
}

function closeDropdownExternal(e) {
  const container = document.getElementById('dropdown-container');
  if (container && !container.contains(e.target)) {
    document.getElementById('dropdown-list').style.display = 'none';
    document.getElementById('dropdown-arrow')?.classList.remove('rotated');
  }
}

/**
 * KONTAKT SELEKTION
 */
function handleContactClick(e, li, contact) {
  e.stopPropagation();
  const isSelected = selectedContacts.has(contact.id);
  isSelected ? selectedContacts.delete(contact.id) : selectedContacts.set(contact.id, contact);
  li.classList.toggle('selected', !isSelected);
  renderSelectedContacts();
}

function renderSelectedContacts() {
  const box = document.getElementById('selected-contacts');
  if (!box) return;
  box.innerHTML = '';
  selectedContacts.forEach(contact => {
    const tag = document.createElement('span');
    tag.textContent = getInitial(contact.name);
    tag.style.backgroundColor = contact.color || "#D1D1D1";
    tag.className = 'assign-to-initial';
    box.appendChild(tag);
  });
  updateSearchPlaceholder();
}

/**
 * HILFSFUNKTIONEN
 */
function filterContacts() {
  const filter = document.getElementById('contact-search-input')?.value.toLowerCase();
  const listItems = document.querySelectorAll('#dropdown-list li');
  listItems.forEach(li => {
    const name = li.querySelector('.contact-info span')?.textContent.toLowerCase();
    li.style.display = name?.includes(filter) ? "" : "none";
  });
  document.getElementById('dropdown-list').style.display = 'block';
}

function updateSearchPlaceholder() {
  const input = document.getElementById('contact-search-input');
  if (!input) return;
  input.placeholder = selectedContacts.size > 0
    ? `${selectedContacts.size} contact(s) selected`
    : 'Select contacts to assign';
}

function resetSelectedContacts() {
  selectedContacts.clear();
  renderSelectedContacts();
  document.querySelectorAll("#dropdown-list li").forEach(li => li.classList.remove("selected"));
}

function getInitial(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * TASK ERSTELLUNG
 */
function createTask() {
  if (!taskFormManager.validateAll()) return;
  saveToStorage(assembleTask());
  clearFields();
  handleAddTaskSuccess();
}

function assembleTask() {
  const cat = document.getElementById('task-category');
  return {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    dueDate: document.getElementById('task-due-date').value,
    priority: document.querySelector('.priority__button.active')?.value || 'medium',
    taskType: cat.options[cat.selectedIndex].text.toLowerCase(),
    category: 'to do',
    assignedTo: Array.from(selectedContacts.keys()),
    subtasks: getSubtasks()
  };
}

function getSubtasks() {
  return Array.from(document.querySelectorAll('#added-subtask .subtask-text'))
    .map(st => ({ title: st.textContent.trim(), done: false }));
}

/**
 * VALIDIERUNG (CLEANED)
 */
const taskFormManager = {
  fields: [
    { id: 'task-title', err: 'title-error-message' },
    { id: 'task-due-date', err: 'date-error-message' },
    { id: 'task-category', err: 'category-error-message' }
  ],
  validateAll() {
    let isAllValid = true;
    this.fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errorSpan = document.getElementById(f.err);
      const isValid = input && input.value.trim() !== "";
      if (!isValid) {
        if (errorSpan) { errorSpan.style.display = 'block'; errorSpan.textContent = 'This field is required'; }
        input.classList.add('error-border');
        isAllValid = false;
      } else {
        if (errorSpan) errorSpan.style.display = 'none';
        input.classList.remove('error-border');
      }
    });
    return isAllValid;
  }
};

function saveToStorage(newTask) {
  const raw = sessionStorage.getItem('joinData');
  const data = raw ? JSON.parse(raw) : { tasks: {} };
  data.tasks[`task${Date.now()}`] = newTask;
  sessionStorage.setItem('joinData', JSON.stringify(data));
}

document.addEventListener('click', closeDropdownExternal);