const STORE_KEY = "joinData";

let dataStore = {
    tasks: null,
    contacts: null,
    users: null
};

/**
 * Initialisiert den Store.
 * Lädt Daten aus SessionStorage oder Firebase.
 */
async function initDataStore() {

    // 🔹 Cache prüfen
    const cached = sessionStorage.getItem(STORE_KEY);

    if (cached) {
        dataStore = JSON.parse(cached);
        console.log("Loaded from session cache");
        return;
    }

    console.log("Loading from Firebase...");

    // 🔹 Firebase einmal laden
    dataStore.tasks = await getData("tasks");
    dataStore.contacts = await getData("contacts");
    dataStore.users = await getData("users");

    saveStore();
}

/**
 * Speichert aktuellen Store in SessionStorage.
 */
function saveStore() {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(dataStore));
}


/* ---------- Getter ---------- */

function getTasks() {
    return dataStore.tasks ? Object.keys(dataStore.tasks).map(id => ({
        id,
        ...dataStore.tasks[id]
    })) : [];
}

function getUsers() {
    return dataStore.users || [];
}

function getContacts() {
    return dataStore.contacts || [];
}


/* ---------- Optional Updates ---------- */

function updateContacts(newContacts) {
    dataStore.contacts = newContacts;
    saveStore();
}

function updateTasks(newTasks) {
    dataStore.tasks = newTasks;
    saveStore();
}