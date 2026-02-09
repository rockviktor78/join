/**
 * Stores all loaded contacts from the database.
 * @type {Array<{name: string, email: string, phone: string}>}
 */
let loadedContacts = [];

/**
 * Base URL of the Firebase Realtime Database.
 * @type {string}
 */
const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the contact module.
 * Fetches all contacts from the database.
 *
 * @async
 * @returns {Promise<void>}
 */
async function initContacts() {
  await fetchContacts();
}

/**
 * Fetches contacts from Firebase.
 *
 * @async
 * @param {string} [path="contacts"] - Database path for contacts
 * @returns {Promise<void>}
 */
async function fetchContacts(path = "contacts") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  loadedContacts = responseToJson ? Object.values(responseToJson) : [];
  sortContacts();
  renderContactList(loadedContacts);
}

/**
 * Sorts contacts alphabetically by name (German locale).
 */
function sortContacts() {
  loadedContacts.sort((a, b) =>
    a.name.localeCompare(b.name, "de", { sensitivity: "base" }),
  );
}

/**
 * Returns the first letter of a name.
 *
 * @param {string} name - Contact name
 * @returns {string} Uppercase first letter
 */
function getFirstLetter(name) {
  return name.charAt(0).toUpperCase();
}

/**
 * Renders the complete contact list including letter groups.
 *
 * @param {Array} loadedContacts - List of contacts
 */
function renderContactList(loadedContacts) {
  let container = getContactsContainer();
  let lastLetter = "";
  loadedContacts.forEach((contact, index) => {
    lastLetter = renderLetterGroup(container, contact.name, lastLetter);
    renderContact(container, contact, index);
  });
  applyRandomBadgeColor();
}

/**
 * Returns the contact list container and clears it.
 *
 * @returns {HTMLElement} Contact list container
 */
function getContactsContainer() {
  let container = document.getElementById("contacts-ul");
  container.innerHTML = "";
  return container;
}

/**
 * Renders a new letter group if required.
 *
 * @param {HTMLElement} container - Contact list container
 * @param {string} name - Contact name
 * @param {string} lastLetter - Previously rendered letter
 * @returns {string} Current letter
 */
function renderLetterGroup(container, name, lastLetter) {
  let firstLetter = getFirstLetter(name);

  if (firstLetter !== lastLetter) {container.innerHTML += templateRenderLetterGroup(firstLetter);
    return firstLetter;
    }
  return lastLetter;
}

/**
 * Renders a single contact entry.
 *
 * @param {HTMLElement} container - Contact list container
 * @param {{name: string, email: string}} contact - Contact object
 * @param {number} index - Contact index
 */
function renderContact(container, contact, index) {
  let initial = getInitial(contact.name);
  container.innerHTML += templateContact(
    initial,
    contact.name,
    contact.email,
    index,
  );
}

/**
 * Returns the initials of a name.
 *
 * @param {string} name - Full name
 * @returns {string} Initials (e.g. "JD")
 */
function getInitial(name) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/);
  let first = parts[0].charAt(0);
  let last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * Applies random background colors to contact badges.
 */
function applyRandomBadgeColor() {
  const colors = 16;
  document.querySelectorAll(".badge").forEach((badge) => {
    const random = Math.floor(Math.random() * colors) + 1;
    badge.style.backgroundColor = `var(--color-badge-${random})`;
  });
}

/**
 * Displays detailed information for a selected contact.
 *
 * @param {number} index - Contact index
 */
function showContactDetails(index) {
  let contact = loadedContacts[index];
  let detailsContainer = document.getElementById("contacts-detail");
  let initial = getInitial(contact.name);
  let badgeColor = document.querySelectorAll(".badge")[index].style.backgroundColor;
  detailsContainer.innerHTML = "";
  detailsContainer.innerHTML += templateContactDetails(contact, index, initial, badgeColor);
  setActiveContact(index);
}

/**
 * Highlights the active contact in the list.
 *
 * @param {number} index - Contact index
 */
function setActiveContact(index) {
  document
    .querySelectorAll(".active-contact")
    .forEach((el) => el.classList.remove("active-contact"));
  document.getElementById(loadedContacts[index].name).classList.add("active-contact");
}

/**
 * Opens the form to add a new contact.
 */
function addNewContact() {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let newContactContainer = document.getElementById("contacts-form");
  newContactContainer.innerHTML = "";
  newContactContainer.innerHTML += templateAddNewContact();
  requestAnimationFrame(() => {newContactContainer.classList.add("active");});
}

/**
 * Confirms editing of a contact.
 *
 * @param {number} index - Contact index
 */
function confirmEditContact(index) {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  updateContact(index, name, phone, email);
}

/**
 * Deletes a contact from the list.
 *
 * @param {number} index - Contact index
 */
function deleteContact(index) {
  loadedContacts.splice(index, 1);
  document.getElementById("contacts-detail").innerHTML = "";
  sortContacts();
  renderContactList(loadedContacts);
  closeEditContact();
}

/**
 * Opens the edit form for a contact.
 *
 * @param {number} index - Contact index
 */
function editContact(index) {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let name = loadedContacts[index].name;
  let email = loadedContacts[index].email;
  let phone = loadedContacts[index].phone;
  let initial = getInitial(loadedContacts[index].name);
  let badgeColor = document.querySelectorAll(".badge")[index].style.backgroundColor;
  let editContactContainer = document.getElementById("contacts-form");
  editContactContainer.innerHTML = "";
  editContactContainer.innerHTML += templateEditContact(index, name, email, phone, initial,badgeColor);
  requestAnimationFrame(() => {editContactContainer.classList.add("active");});
}

/**
 * Shows overlay and contact form.
 */
function showEditContact() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loaded-contact-form").style.display = "block";
}

/**
 * Closes the contact form when clicking outside.
 */
document.addEventListener("click", (event) => {
  let card = document.getElementById("loaded-contact-form");

  if (!card) return;
  if (!card.contains(event.target)) {
    closeEditContact();
  }
});

/**
 * Closes the contact form and removes overlay.
 */
function closeEditContact() {
  document.getElementById("contacts-form").classList.remove("active");
  setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("loaded-contact-form").style.display = "none";
    document.body.style.overflow = "auto";
  }, 350);
}


/**
 * Cancels contact creation or editing.
 */
function cancel() {
  document.getElementById("contacts-form").innerHTML = "";
}

/**
 * Creates a new contact and displays it.
 */
function createNewContact() {
  let newContact = pushNewContact();
  if (!newContact) return;
  sortContacts();
  renderContactList(loadedContacts);
  let newIndex = loadedContacts.findIndex((contact) => contact === newContact);
  showContactDetails(newIndex);
  clearContactForm();
  showSuccessMessage();
}

/**
 * Validates the contact form.
 *
 * @param {string} name
 * @param {string} phone
 * @param {string} email
 * @returns {boolean} True if valid
 */
function isContactFormValid(name, phone, email) {
  if (!name || !phone || !email) {
    alert("Bitte alle Felder ausfüllen");
    return false;
  }
  return true;
}

/**
 * Clears the contact form and closes it.
 */
function clearContactForm() {
  document.getElementById("new-contact-name").value = "";
  document.getElementById("new-contact-email").value = "";
  document.getElementById("new-contact-phone").value = "";
  closeEditContact();
}

/**
 * Updates an existing contact.
 *
 * @param {number} index
 * @param {string} name
 * @param {string} phone
 * @param {string} email
 */
function updateContact(index, name, phone, email) {
  loadedContacts[index].name = name;
  loadedContacts[index].phone = phone;
  loadedContacts[index].email = email;
  sortContacts();
  renderContactList(loadedContacts);
  clearContactForm();
}

/**
 * Adds a new contact to the list.
 *
 * @returns {{name: string, phone: string, email: string}|undefined}
 */
function pushNewContact() {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  if (!isContactFormValid(name, phone, email)) {
    return;
  }
  let newContact = {name: name, phone: phone, email: email};
  loadedContacts.push(newContact);
  return newContact;
}

/**
 * Shows a temporary success message.
 */
function showSuccessMessage() {
  let message = document.getElementById("successMessage");
  message.classList.add("show");
  setTimeout(() => {
    message.classList.remove("show");
  }, 2000);
}