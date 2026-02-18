/**
 * Stores all loaded contacts for the contacts page.
 * @type {Array<{id: string, name: string, email: string, phone: string, color?: string}>}
 */
let loadedContacts = [];

/**
 * Initializes the contacts module.
 * Loads contacts from dataStore and applies badge colors.
 *
 * @async
 * @returns {Promise<void>}
 */
async function initContacts() {
  // DataStore initialisieren (Tasks, Contacts, Users laden)
  await initDataStore();

  // Kontakte aus DataStore laden, Farben zuweisen und rendern
  loadContactsFromStore();
}




/**
 * Loads contacts from the dataStore and applies badge colors.
 * Keeps the array structure for rendering.
 */
function loadContactsFromStore() {
  const contactsArray = Object.keys(dataStore.contacts || {}).map(id => ({
    id,
    ...dataStore.contacts[id]
  }));

  loadedContacts = assignContactColorsArray(contactsArray); // immer Array
  sortContacts();
  renderContactList(loadedContacts);
}



/**
 * Sorts contacts alphabetically by name (German locale).
 */
function sortContacts() {
  loadedContacts.sort((a, b) =>
    a.name.localeCompare(b.name, "de", { sensitivity: "base" })
  );
}

/**
 * Returns the first letter of a name.
 *
 * @param {string} name
 * @returns {string} Uppercase first letter
 */
function getFirstLetter(name) {
  return name.charAt(0).toUpperCase();
}

/**
 * Renders the contact list with letter groups.
 */
function renderContactList(contactsArray) {
  let container = getContactsContainer();
  let lastLetter = "";
  contactsArray.forEach((contact, index) => {
    lastLetter = renderLetterGroup(container, contact.name, lastLetter);
    renderContact(container, contact, index);
  });
}

/**
 * Gets the container for the contacts list and clears it.
 */
function getContactsContainer() {
  let container = document.getElementById("contacts-ul");
  container.innerHTML = "";
  return container;
}

/**
 * Renders a letter group if the first letter changed.
 */
function renderLetterGroup(container, name, lastLetter) {
  let firstLetter = getFirstLetter(name);
  if (firstLetter !== lastLetter) {
    container.innerHTML += templateRenderLetterGroup(firstLetter);
    return firstLetter;
  }
  return lastLetter;
}

/**
 * Renders a single contact entry.
 */
function renderContact(container, contact, index) {
  let initial = getInitial(contact.name);
  let color = contact.color || "#D1D1D1";
  container.innerHTML += templateContact(
    initial,
    contact.name,
    contact.email,
    color,
    index
  );
}


/**
 * Returns initials for a contact.
 */
function getInitial(name) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/);
  let first = parts[0].charAt(0);
  let last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * Shows details for a selected contact.
 */
function showContactDetails(index) {
  let contact = loadedContacts[index];
  let detailsContainer = document.getElementById("contacts-detail");
  let initial = getInitial(contact.name);
  let badgeColor = contact.color || "#D1D1D1"; // fallback
  detailsContainer.innerHTML = templateContactDetails(contact, index, initial, badgeColor);
  setActiveContact(index);
  checkMobile(index);
}

/**
 * Highlights the active contact in the list.
 */
function setActiveContact(index) {
  document
    .querySelectorAll(".active-contact")
    .forEach(el => el.classList.remove("active-contact"));
  document.getElementById(loadedContacts[index].name).classList.add("active-contact");
}

/**
 * Opens the overlay to add a new contact.
 */
function addNewContact() {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let newContactContainer = document.getElementById("contacts-form");
  newContactContainer.innerHTML = templateAddNewContact();
  requestAnimationFrame(() => newContactContainer.classList.add("active"));
}

/**
 * Confirms editing a contact.
 */
function confirmEditContact(index) {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  updateContact(index, name, phone, email);
}

/**
 * Deletes a contact.
 */
function deleteContact(index) {
  loadedContacts.splice(index, 1);
  document.getElementById("contacts-detail").innerHTML = "";
  sortContacts();
  renderContactList(loadedContacts);
  closeEditContact();
  closeActionFab();
}

/**
 * Opens the edit form for a contact.
 */
function editContact(index) {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let contact = loadedContacts[index];
  let initial = getInitial(contact.name);
  let badgeColor = contact.color || "#D1D1D1";
  let editContactContainer = document.getElementById("contacts-form");
  editContactContainer.innerHTML = templateEditContact(
    index,
    contact.name,
    contact.email,
    contact.phone,
    initial,
    badgeColor
  );
  requestAnimationFrame(() => editContactContainer.classList.add("active"));
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
document.addEventListener("click", event => {
  let card = document.getElementById("loaded-contact-form");
  if (!card) return;
  if (!card.contains(event.target)) closeEditContact();
});

/**
 * Closes the contact form overlay.
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
 * Creates a new contact.
 */
function createNewContact() {
  let newContact = pushNewContact();
  if (!newContact) return;
  sortContacts();
  renderContactList(loadedContacts);
  let newIndex = loadedContacts.findIndex(c => c === newContact);
  showContactDetails(newIndex);
  clearContactForm();
  showSuccessMessage();
}

/**
 * Validates contact form fields.
 */
function isContactFormValid(name, phone, email) {
  if (!name || !phone || !email) {
    alert("Bitte alle Felder ausfüllen");
    return false;
  }
  return true;
}

/**
 * Clears the contact form.
 */
function clearContactForm() {
  document.getElementById("new-contact-name").value = "";
  document.getElementById("new-contact-email").value = "";
  document.getElementById("new-contact-phone").value = "";
  closeEditContact();
}

/**
 * Updates an existing contact.
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
 * Adds a new contact to loadedContacts array.
 */
function pushNewContact() {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  if (!isContactFormValid(name, phone, email)) return;

  const newContact = {
    id: crypto.randomUUID(),
    name,
    phone,
    email,
    color: assignContactColorsArray([{ id: crypto.randomUUID(), name, phone, email }])[0].color
  };

  loadedContacts.push(newContact);
  return newContact;
}

/**
 * Shows a temporary success message.
 */
function showSuccessMessage() {
  let message = document.getElementById("successMessage");
  message.classList.add("show");
  setTimeout(() => message.classList.remove("show"), 2000);
}

document.addEventListener("DOMContentLoaded", initContacts);

