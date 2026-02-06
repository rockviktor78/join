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
        <div class="contact-detail-slide">
            <div class="contacts-detail-header">
                ${templateContactDetailHeader(contact, index, initial, badgeColor)}
            </div>
            <div>
                <div class="contact-information-title">Contact Information</div>              
            </div>
            <div class="contacts-detail-information">
                ${templateContactDetailInformation(contact)}
            </div>
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
            <div class="contact-info-phone">${contact.phone || "N/A"}</div>
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
        <div class="form-contact-container">
            <div class="form-contact-header">
                ${templateAddNewContactheader()}
            </div>
                <div class="add-new-contact-profile-picture">
                    ${templateAddNewContactProfilePicture()}
                </div>
            <div class="add-new-contact-form">
                ${templateAddNewContactForm()}
            </div>
        </div>
    `;
}

function templateAddNewContactheader() {
  return `
        <div><img src="../assets/img/contacts/join_logo.svg" alt="Join Logo"></div>
        <div>
            <div class="form-contact-header-title">Add Contact </div>
            <div class="form-contact-subtitle">Tasks are better with a team!</div>
        </div>
        <div class="form-contact-header-line">___________________</div>
    `;
}

function templateAddNewContactProfilePicture() {
  return `
        <div class="contact-detail-initial" style="background-color: #D1D1D1;"><img src="../assets/img/contacts/personwhite.svg" alt="Contact Initial"></div>
    `;
}

function templateAddNewContactForm() {
  return `
        <div class="close-button" onclick="closeEditContact()"><img src="../assets/img/contacts/cancel.svg" alt="Cancel"></div>
        <input type="text" class="form-input-name" id="new-contact-name" placeholder="Name" value="" required>
        <input type="email" class="form-input-email" id="new-contact-email" placeholder="Email" value="" required>
        <input type="text" class="form-input-phone" id="new-contact-phone" placeholder="Phone" value="" required>
        <div class="form-contact-buttons">
            <button onclick="closeEditContact()" class="cancel-button">Cancel <img src="../assets/img/contacts/cancel.svg" alt="Cancel"></button>
            <button onclick="createNewContact()" class="create-contact-button">Create Contact <img src="../assets/img/contacts/check.svg" alt="Save"></button>
        </div>
    `;
}

function templateEditContact(index, name, email, phone, initial, badgeColor) {
  return `
        <div class="form-contact-container">
            <div class="form-contact-header">
              ${templateEditContactHeader()}
            </div>
                <div class="add-new-contact-profile-picture">
                    ${templateEditContactProfilePicture(badgeColor, initial)}
                </div>
            <div class="add-new-contact-form">
                ${templateEditContactForm(name, email, phone, index)}
            </div>
        </div>
    `;
}

function templateEditContactHeader() {
  return `
        <div><img src="../assets/img/contacts/join_logo.svg" alt="Join Logo"></div>
        <div class="form-contact-header-title">Edit contact</div>
        <div class="form-contact-header-line">___________________</div>
    `;
}

function templateEditContactProfilePicture(badgeColor, initial) {
  return `
        <div class="contact-detail-initial" style="background-color: ${badgeColor};">
            ${initial}
        </div>

    `;
}

function templateEditContactForm(name, email, phone, index) {
  return `
        <div class="close-button" onclick="closeEditContact()"><img src="../assets/img/contacts/cancel.svg" alt="Cancel"></div>
        <input type="text" class="form-input-name" id="new-contact-name" placeholder="Name" value="${name}" required>
        <input type="email" class="form-input-email" id="new-contact-email" placeholder="Email" value="${email}" required>
        <input type="text" class="form-input-phone" id="new-contact-phone" placeholder="Phone" value="${phone}" required>
        <div class="form-contact-buttons">
            <button onclick="deleteContact(${index})" class="delete-button">Delete</button>
            <button onclick="confirmEditContact(${index})" class="save-contact-button">Save <img src="../assets/img/contacts/check.svg" alt="Save"></button>
        </div>
    `;
}
