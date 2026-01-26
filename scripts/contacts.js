let loadedContacts = [];

const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
    await fetchContacts();
}

async function fetchContacts(path = "contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    
    loadedContacts = responseToJson ? Object.values(responseToJson) : [];
    console.log(loadedContacts);
    sortContacts();
    renderContactList(loadedContacts);

}

function sortContacts() { 
    loadedContacts.sort((a, b) => 
    a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
);

}

function renderContactList(loadedContacts) {
    let contactsContainer = document.getElementById("contacts-container");
    contactsContainer.innerHTML = "";

    for (let index = 0; index < loadedContacts.length; index++) {
        let name = loadedContacts[index].name;
        let email = loadedContacts[index].email;
        let initial = getInitial(name);

        contactsContainer.innerHTML += templateContact(initial, name, email, index);   
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

function templateContact(initial, name, email, index) {
    return `
        <div class="contact-card" id="${name}" onclick="showContactDetails('${index}')">
            <h3>${initial}, ${name}</h3>
            <p>Email: ${email}</p>
        </div>
    `;
}

function showContactDetails(index) {
    console.log("Showing details for contact:", index, loadedContacts[index]);
}


function addNewContact() {

}

function deleteContact(contactId) {

}

function editContact(contactId) {

}

function cancelContactEdit(contactId) {
    
}

function createNewContact() {

}

function saveContactEdit(contactId) {

}

function showSuccessMessage(message) {

}