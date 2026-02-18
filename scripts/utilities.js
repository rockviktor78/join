/**
 * Assigns colors to contacts based on CSS variables and stores them in localStorage.
 * Converts contacts array to object keyed by id so badges render correctly.
 */
function assignContactColors(contactsArray) {
    const storedColors = loadStoredColors();
    const badgeColors = getBadgeColors();

    const updatedContacts = applyColorsToContacts(
        contactsArray,
        storedColors,
        badgeColors
    );

    saveStoredColors(storedColors);

    return updatedContacts;
}


/**
 * Loads the stored contact colors from localStorage.
 *
 * @returns {Object} An object mapping contacts to their stored colors, or an empty object if none are stored.
 */
function loadStoredColors() {
    return JSON.parse(localStorage.getItem("contactColors")) || {};
}


/**
 * Saves the contact colors to localStorage.
 *
 * @param {Object} colors - An object mapping contacts to their colors.
 */
function saveStoredColors(colors) {
    console.log("Saving colors:", colors);
    localStorage.setItem("contactColors", JSON.stringify(colors));
}


/**
 * Retrieves the badge colors defined in CSS variables (--color-badge-1 to --color-badge-16).
 *
 * @returns {Array<string>} An array of badge color values as strings.
 */
function getBadgeColors() {
    const colors = [];

    for (let i = 1; i <= 16; i++) {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue(`--color-badge-${i}`)
            .trim();

        colors.push(color);
    }
    return colors;
}


/**
 * Assigns colors to contacts, using stored colors if available, 
 * or cycling through available badge colors for new contacts.
 *
 * @param {Array<Object>} contactsArray - Array of contact objects.
 * @param {Object} storedColors - Previously stored colors mapped by contact ID.
 * @param {Array<string>} badgeColors - Array of available badge colors to assign.
 * @returns {Object} An object mapping contact IDs to the contact objects with assigned colors.
 */
function applyColorsToContacts(contactsArray, storedColors, badgeColors) {
    const result = {};
    let colorIndex = 0;

    contactsArray.forEach(contact => {
        if (!contact.id) return;

        if (storedColors[contact.id]) {
            contact.color = storedColors[contact.id];
        } else {
            const newColor = badgeColors[colorIndex];
            contact.color = newColor;
            storedColors[contact.id] = newColor;

            colorIndex = (colorIndex + 1) % badgeColors.length;
        }

        result[contact.id] = contact;
    });

    return result;
}




