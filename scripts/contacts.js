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
}


function addNewContact() {
    let newContactContainer = document.getElementById("contacts-detail");
    newContactContainer.innerHTML = "";
    newContactContainer.innerHTML += templateAddNewContact();

}

function confirmAddNewContact() {

}

function deleteContact(index) {
    console.log("Deleting contact:", index);

}

function editContact(index) {
    console.log("Editing contact:", index);
    let name = loadedContacts[index].name;
    let email = loadedContacts[index].email;
    let phone = loadedContacts[index].phone;
    let editContactContainer = document.getElementById("contacts-detail");
    editContactContainer.innerHTML = "";
    editContactContainer.innerHTML += templateEditContact(index, name, email, phone);

    
}

function cancel() {
    document.getElementById("contacts-detail").innerHTML = "";
}

function createNewContact() {

}

function saveContactEdit() {

}

function showSuccessMessage(message) {

}

function templateContact(initial, name, email, index) {
    return `
        <div class="contact-card" id="${name}" onclick="showContactDetails('${index}')">
            <div class="contact-initial badge">${initial}</div>
            <div>
                <h3>${name}</h3>
                <p>${email}</p>
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
            <div>
                <div>Contact Information</div>              
            </div>  
        </div>
        <div class="contacts-detail-information">
            ${templateContactDetailInformation(contact)}
        </div>
    `;
}

function templateContactDetailHeader(contact, index, initial, badgeColor) {
    return `
       <div class="contact-detail-initial" style="background-color: ${badgeColor};">${initial}</div>
            <div>
                <h2>${contact.name}</h2>
                <button onclick="editContact(${index})">Edit</button>
                <button onclick="deleteContact(${index})">Delete</button>
            </div>
    `;
}

function templateContactDetailInformation(contact) {
    return `
       <div class="contact-info">
            <div>Email</div> 
            <div>${contact.email}</div>
            <div>Phone</div> 
            <div>${contact.phone || 'N/A'}</div>
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

function templateEditContact(index, name, email, phone) {
    return `
        <div class="add-new-contact-container">
            <div class="add-new-contact-header">
                <h2>Add Contact</h2>
                <p>Tasks are better with a team!</p>
            </div>
                <div class="add-new-contact-profile-picture">Profile Picture Placeholder</div>
            <div class="add-new-contact-form">
                <input type="text" class="form-input" id="new-contact-name" placeholder="Name" value="${name}" required>
                <input type="email" class="form-input" id="new-contact-email" placeholder="Email" value="${email}" required>
                <input type="text" class="form-input" id="new-contact-phone" placeholder="Phone" value="${phone}" required>
                <div>
                    <button onclick="showContactDetails(${index})" class="cancel-button">Delete</button>
                    <button onclick="confirmEditContact(${index})" class="create-contact-button">Save</button>
                </div>
            </div>
        </div>
    `;
}