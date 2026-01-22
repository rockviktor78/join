let usersData = [];
const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
    await loadData();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();

    usersData = responseToJson || [];
    console.log(usersData);

}