const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();
        return responseToJson;
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}


async function postData(path = "users", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

