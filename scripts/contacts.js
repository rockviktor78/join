let loadedContacts = [];

const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
    await fetchContacts();
}

async function fetchContacts(path = "contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    
    loadedContacts = responseToJson ? Object.values(responseToJson) : [];
    sortContacts();
    renderContactList(loadedContacts);

}

function sortContacts() { 
    loadedContacts.sort((a, b) => 
    a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
    );
}

function getFirstLetter(name) {
    return name.charAt(0).toUpperCase();
}

function renderContactList(loadedContacts) {
    let container = getContactsContainer();
    let lastLetter = "";

    loadedContacts.forEach((contact, index) => {
        lastLetter = renderLetterGroup(container, contact.name, lastLetter);
        renderContact(container, contact, index);
    });

    applyRandomBadgeColor();
}

function getContactsContainer() {
    let container = document.getElementById("contacts-ul");
    container.innerHTML = "";
    return container;
}

function renderLetterGroup(container, name, lastLetter) {
    let firstLetter = getFirstLetter(name);

    if (firstLetter !== lastLetter) {
        container.innerHTML += templateRenderLetterGroup(firstLetter);
        return firstLetter;
    }
    return lastLetter;
}

function renderContact(container, contact, index) {
    let initial = getInitial(contact.name);
    container.innerHTML += templateContact(initial, contact.name, contact.email, index);
}


function getInitial(name) {
     if (!name) return "";

    let parts = name.trim().split(/\s+/);

    let first = parts[0].charAt(0);
    let last  = parts.length > 1 
        ? parts[parts.length - 1].charAt(0)
        : "";

    return (first + last).toUpperCase();
}

function applyRandomBadgeColor() {
    const colors = 16;
    
    document.querySelectorAll('.badge').forEach(badge => {
    const random = Math.floor(Math.random() * colors) +1;
    badge.style.backgroundColor = `var(--color-badge-${random})`;
  });
}



function showContactDetails(index) {
    let contact = loadedContacts[index];
    let detailsContainer = document.getElementById("contacts-detail");
    let initial = getInitial(contact.name);
    let badgeColor = document.querySelectorAll('.badge')[index].style.backgroundColor;
    detailsContainer.innerHTML = "";
    detailsContainer.innerHTML += templateContactDetails(contact, index, initial, badgeColor);
    setActiveContact(index);
}

function setActiveContact(index) {
    document.querySelectorAll(".active-contact").forEach(el => el.classList.remove("active-contact"));
    document.getElementById(loadedContacts[index].name).classList.add("active-contact");
}


function addNewContact() {
    let newContactContainer = document.getElementById("contacts-form");
    newContactContainer.innerHTML = "";
    newContactContainer.innerHTML += templateAddNewContact();
}

function confirmAddNewContact() {

}

function deleteContact(index) {
    console.log("Deleting contact:", index);

}

function editContact(index) {
    document.body.style.overflow = 'hidden';
    event.stopPropagation();
    showEditContact();
    let name = loadedContacts[index].name;
    let email = loadedContacts[index].email;
    let phone = loadedContacts[index].phone;
    let initial = getInitial(loadedContacts[index].name);
    let badgeColor = document.querySelectorAll('.badge')[index].style.backgroundColor;
    let editContactContainer = document.getElementById("contacts-form");
    editContactContainer.innerHTML = "";
    editContactContainer.innerHTML += templateEditContact(index, name, email, phone, initial, badgeColor);
    requestAnimationFrame(() => {editContactContainer.classList.add("active");});
}

function showEditContact() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("loaded-contact-form").style.display = "block";
}


document.addEventListener('click', (event) => {
  let card = document.getElementById('loaded-contact-form');

    if (!card) return;
    if (!card.contains(event.target)) {
        closeEditContact();
        }
    }
);

function closeEditContact() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("loaded-contact-form").style.display = "none";
    document.body.style.overflow = 'auto';
}

function cancel() {
    document.getElementById("contacts-form").innerHTML = "";
}

function createNewContact() {

}

function saveContactEdit() {

}

function showSuccessMessage() {

}

function templateContact(initial, name, email, index) {
    return `
        <div class="contact-card" id="${name}" onclick="showContactDetails('${index}')">
            <div class="contact-initial badge">${initial}</div>
            <div>
                <h3>${name}</h3>
                <div class="contact-email">${email}</div>
            </div>
        </div>
    `;
}

function templateContactDetails(contact, index, initial, badgeColor) {
    return `
        <div class="contacts-detail-header">
            ${templateContactDetailHeader(contact, index, initial, badgeColor)}
        </div>
        <div>
            <div class="contact-information-title">Contact Information</div>              
        </div>
        <div class="contacts-detail-information">
            ${templateContactDetailInformation(contact)}
        </div>
    `;
}

function templateContactDetailHeader(contact, index, initial, badgeColor) {
    return `
       <div class="contact-detail-initial" style="background-color: ${badgeColor};">${initial}</div>
            <div class="contact-detail-name-and-actions">
                <div class="contact-detail-name">${contact.name}</div>
                <div>
                    <button onclick="editContact(${index})" class="contact-detail-edit-button"></button>
                    <button onclick="deleteContact(${index})" class="contact-detail-delete-button"></button>
                </div>
            </div>
    `;
}

function templateContactDetailInformation(contact) {
    return `
       <div class="contact-info">
            <div class="contact-info-header">Email</div> 
            <div class="contact-info-email">${contact.email}</div>
            <div class="contact-info-header">Phone</div> 
            <div class="contact-info-phone">${contact.phone || 'N/A'}</div>
        </div>
    `;    
}

function templateRenderLetterGroup(firstLetter) {
    return `
        <div class="letter-group">
            <h2 class="letter-title">${firstLetter}</h2>
            <hr>
        </div>
    `;
}

function templateAddNewContact() {
    return `
        <div class="add-new-contact-container">
            <div class="add-new-contact-header">
                <h2>Add Contact</h2>
                <p>Tasks are better with a team!</p>
            </div>
                <div class="add-new-contact-profile-picture">Profile Picture Placeholder</div>
            <div class="add-new-contact-form">
                <input type="text" class="form-input" id="new-contact-name" placeholder="Name" required>
                <input type="email" class="form-input" id="new-contact-email" placeholder="Email" required>
                <input type="text" class="form-input" id="new-contact-phone" placeholder="Phone" required>
                <div>
                    <button onclick="cancel()" class="cancel-button">Cancel X</button>
                    <button onclick="confirmAddNewContact()" class="create-contact-button">Create contact</button>
                </div>
            </div>
        </div>
    `;
}

function templateEditContact(index, name, email, phone, initial, badgeColor) {
    return `
        <div class="form-contact-container">
            <div class="form-contact-header">
                <div><img src="../assets/img/contacts/join_logo.svg" alt="Join Logo"></div>
                <div class="form-contact-header-title">Edit Contact</div>
                <div class="form-contact-header-line">___________________</div>
            </div>
                <div class="add-new-contact-profile-picture">
                    <div class="contact-detail-initial" style="background-color: ${badgeColor};">
                        ${initial}
                    </div>
                </div>
            <div class="add-new-contact-form">
                <div class="close-button" onclick="closeEditContact()">X</div>
                <input type="text" class="form-input" id="new-contact-name" placeholder="Name" value="${name}" required>
                <input type="email" class="form-input" id="new-contact-email" placeholder="Email" value="${email}" required>
                <input type="text" class="form-input" id="new-contact-phone" placeholder="Phone" value="${phone}" required>
                <div class="form-contact-buttons">
                    <button onclick="showContactDetails(${index})" class="delete-button">Delete</button>
                    <button onclick="confirmEditContact(${index})" class="save-contact-button">Save <img src="../assets/img/contacts/check.svg" alt="Save"></button>
                </div>
            </div>
        </div>
    `;
}