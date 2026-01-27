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

function renderContactList(loadedContacts) {
    let contactsContainer = document.getElementById("contacts-ul");
    contactsContainer.innerHTML = "";

    for (let index = 0; index < loadedContacts.length; index++) {
        let name = loadedContacts[index].name;
        let email = loadedContacts[index].email;
        let initial = getInitial(name);

        contactsContainer.innerHTML += templateContact(initial, name, email, index); 
        applyRandomBadgeColor();
    }
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

function showContactDetails(index) {
    let contact = loadedContacts[index];
    let detailsContainer = document.getElementById("contacts-detail");
    let initial = getInitial(contact.name);
    let badgeColor = document.querySelectorAll('.badge')[index].style.backgroundColor;
    detailsContainer.innerHTML = "";
    detailsContainer.innerHTML += templateContactDetails(contact, index, initial, badgeColor);
}

function templateContactDetails(contact, index, initial, badgeColor) {
    return `
        <div class="contacts-detail-header">
            <div class="contact-detail-initial" style="background-color: ${badgeColor};">${initial}</div>
            <div>
                <h2>${contact.name}</h2>
                <button onclick="editContact(${index})">Edit</button>
                <button onclick="deleteContact(${index})">Delete</button>
            </div>
        </div>
        <div>
            <div>
                <div>Contact Information</div>
                <div class="contact-info">
                    <div>Email</div> 
                    <div>${contact.email}</div>
                    <div>Phone</div> 
                    <div>${contact.phone || 'N/A'}</div>
                </div>
            </div>  
        </div>
    `;
}


function addNewContact() {

}

function confirmAddNewContact() {

}

function deleteContact(contactId) {
    console.log("Deleting contact:", contactId);

}

function editContact(contactId) {
    console.log("Editing contact:", contactId);
}

function cancelContactEdit(contactId) {
    console.log("Canceling edit for contact:", contactId);
}

function createNewContact() {

}

function saveContactEdit(contactId) {

}

function showSuccessMessage(message) {

}
