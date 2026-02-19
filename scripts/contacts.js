let loadedContacts = [];
let contactIdCounter = 1;

/**
 * Initializes the contacts module by loading contacts from the data store
 * and applying badge colors.
 *
 * @async
 */
async function initContacts() {
  await initDataStore();
  loadContactsFromStore();

  contactIdCounter = getNextContactId(loadedContacts);
}

/**
 * Loads contacts from the data store, applies badge colors, 
 * sorts them, and renders the contact list while keeping the array structure.
 */
function loadContactsFromStore() {
  const contactsArray = Object.keys(dataStore.contacts || {}).map(id => ({
    id,
    ...dataStore.contacts[id]
  }));

  loadedContacts = assignContactColors(contactsArray);
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
  let badgeColor = contact.color || "#D1D1D1";
  detailsContainer.innerHTML = templateContactDetails(contact, index, initial, badgeColor);
  setActiveContact(index);
  checkMobile(index);
}

/**
 * Sets a specific contact as active in the UI by index, 
 * removing the active state from all other contacts.
 *
 * @param {number} index - The index of the contact in the loadedContacts array.
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
  let phone = document.getElementById("new-contact-phone").value;
  let email = document.getElementById("new-contact-email").value;

  updateContact(index, name, phone, email);
}

/**
 * Deletes a contact.
 */
function deleteContact(index) {
  const contact = loadedContacts[index];
  removeContactFromAllTasks(contact.id);
  loadedContacts.splice(index, 1);

  if (dataStore.contacts && contact.id in dataStore.contacts) {
    delete dataStore.contacts[contact.id];
    saveStore();
  }

  document.getElementById("contacts-detail").innerHTML = "";
  sortContacts();
  renderContactList(loadedContacts);
  closeEditContact();
  closeActionFab();
}

/**
 * Removes a contact ID from all tasks' assignedTo arrays.
 * @param {string} contactId
 */
function removeContactFromAllTasks(contactId) {
  if (!dataStore.tasks) return;

  Object.keys(dataStore.tasks).forEach(taskId => {
    const task = dataStore.tasks[taskId];

    if (task.assignedTo && Array.isArray(task.assignedTo)) {
      task.assignedTo = task.assignedTo.filter(id => id !== contactId);
    }
  });

  saveStore();
}

/**
 * Opens the edit contact form for a specific contact by index.
 * Sets up the form with the contact's current details and badge color,
 * and prevents page scrolling while editing.
 *
 * @param {number} index - The index of the contact in the loadedContacts array.
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
 * Validates the contact form fields and alerts if any are empty.
 *
 * @param {string} name - The contact's name.
 * @param {string} phone - The contact's phone number.
 * @param {string} email - The contact's email address.
 * @returns {boolean} True if all fields are filled, false otherwise.
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
 * Updates the details of a contact at a given index, then sorts and re-renders the contact list.
 *
 * @param {number} index - The index of the contact in the loadedContacts array.
 * @param {string} name - The updated name of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @param {string} email - The updated email of the contact.
 */
function updateContact(index, name, phone, email) {
  const contact = loadedContacts[index];
  contact.name = name;
  contact.phone = phone;
  contact.email = email;

  // Update data store
  dataStore.contacts[contact.id] = { name, phone, email, color: contact.color };
  saveStore();
  sortContacts();
  renderContactList(loadedContacts);
  showContactDetails(index);
  clearContactForm();
}


/**
 * Adds a new contact to loadedContacts array and saves it to the data store.
 */
function pushNewContact() {
  const name = document.getElementById("new-contact-name").value.trim();
  const email = document.getElementById("new-contact-email").value.trim();
  const phone = document.getElementById("new-contact-phone").value.trim();

  if (!isContactFormValid(name, phone, email)) return;

  const id = `contactId${contactIdCounter++}`;
  const newContact = { id, name, phone, email };
  const coloredContact = assignContactColors([newContact])[0];
  loadedContacts.push(coloredContact);

  if (!dataStore.contacts) dataStore.contacts = {};
  dataStore.contacts[id] = {
    name: coloredContact.name,
    phone: coloredContact.phone,
    email: coloredContact.email,
    color: coloredContact.color
  };
  saveStore();
  return coloredContact;
}

/**
 * Calculates the next contact ID based on currently loaded contacts.
 * Extracts numeric part from IDs like "contactId12".
 *
 * @param {Array<Object>} contactsArray - Array of loaded contacts
 * @returns {number} Next numeric ID for a new contact
 */
function getNextContactId(contactsArray) {
  if (!contactsArray || contactsArray.length === 0) return 1;

  const ids = contactsArray
    .map(contact => {
      const match = String(contact.id).match(/\d+$/);
      return match ? Number(match[0]) : 0;
    });

  return Math.max(...ids) + 1;
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

