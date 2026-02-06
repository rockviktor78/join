let loadedContacts = [];

const BASE_URL =
  "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

async function initContacts() {
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
    a.name.localeCompare(b.name, "de", { sensitivity: "base" }),
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
  container.innerHTML += templateContact(
    initial,
    contact.name,
    contact.email,
    index,
  );
}

function getInitial(name) {
  if (!name) return "";

  let parts = name.trim().split(/\s+/);
  let first = parts[0].charAt(0);
  let last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

function applyRandomBadgeColor() {
  const colors = 16;
  document.querySelectorAll(".badge").forEach((badge) => {
    const random = Math.floor(Math.random() * colors) + 1;
    badge.style.backgroundColor = `var(--color-badge-${random})`;
  });
}

function showContactDetails(index) {
  let contact = loadedContacts[index];
  let detailsContainer = document.getElementById("contacts-detail");
  let initial = getInitial(contact.name);
  let badgeColor =
    document.querySelectorAll(".badge")[index].style.backgroundColor;
  detailsContainer.innerHTML = "";
  detailsContainer.innerHTML += templateContactDetails(
    contact,
    index,
    initial,
    badgeColor,
  );
  setActiveContact(index);
}

function setActiveContact(index) {
  document
    .querySelectorAll(".active-contact")
    .forEach((el) => el.classList.remove("active-contact"));
  document
    .getElementById(loadedContacts[index].name)
    .classList.add("active-contact");
}

function addNewContact() {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let newContactContainer = document.getElementById("contacts-form");
  newContactContainer.innerHTML = "";
  newContactContainer.innerHTML += templateAddNewContact();
  requestAnimationFrame(() => {
    newContactContainer.classList.add("active");
  });
}

function confirmEditContact(index) {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  updateContact(index, name, phone, email);
}

function deleteContact(index) {
  loadedContacts.splice(index, 1);
  document.getElementById("contacts-detail").innerHTML = "";
  sortContacts();
  renderContactList(loadedContacts);
  closeEditContact();
}

function editContact(index) {
  document.body.style.overflow = "hidden";
  event.stopPropagation();
  showEditContact();
  let name = loadedContacts[index].name;
  let email = loadedContacts[index].email;
  let phone = loadedContacts[index].phone;
  let initial = getInitial(loadedContacts[index].name);
  let badgeColor =
    document.querySelectorAll(".badge")[index].style.backgroundColor;
  let editContactContainer = document.getElementById("contacts-form");
  editContactContainer.innerHTML = "";
  editContactContainer.innerHTML += templateEditContact(
    index,
    name,
    email,
    phone,
    initial,
    badgeColor,
  );
  requestAnimationFrame(() => {
    editContactContainer.classList.add("active");
  });
}

function showEditContact() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loaded-contact-form").style.display = "block";
}

document.addEventListener("click", (event) => {
  let card = document.getElementById("loaded-contact-form");

  if (!card) return;
  if (!card.contains(event.target)) {
    closeEditContact();
  }
});

function closeEditContact() {
  document.getElementById("contacts-form").classList.remove("active");
  setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("loaded-contact-form").style.display = "none";
    document.body.style.overflow = "auto";
  }, 350);
}

function cancel() {
  document.getElementById("contacts-form").innerHTML = "";
}

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

function isContactFormValid(name, phone, email) {
  if (!name || !phone || !email) {
    alert("Bitte alle Felder ausfüllen");
    return false;
  }
  return true;
}

function clearContactForm() {
  document.getElementById("new-contact-name").value = "";
  document.getElementById("new-contact-email").value = "";
  document.getElementById("new-contact-phone").value = "";
  closeEditContact();
}

function updateContact(index, name, phone, email) {
  loadedContacts[index].name = name;
  loadedContacts[index].phone = phone;
  loadedContacts[index].email = email;
  sortContacts();
  renderContactList(loadedContacts);
  clearContactForm();
}

function pushNewContact() {
  let name = document.getElementById("new-contact-name").value.trim();
  let phone = document.getElementById("new-contact-email").value.trim();
  let email = document.getElementById("new-contact-phone").value.trim();
  if (!isContactFormValid(name, phone, email)) {
    return;
  }
  let newContact = {
    name: name,
    phone: phone,
    email: email,
  };
  loadedContacts.push(newContact);
  return newContact;
}

function showSuccessMessage() {
  let message = document.getElementById("successMessage");
  message.classList.add("show");
  setTimeout(() => {
    message.classList.remove("show");
  }, 2000);
}
