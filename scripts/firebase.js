const BASE_URL = "https://join-7c944-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the Firebase Realtime Database.
 * @param {string} [path=""] The path in the database to fetch data from.
 * @return {Promise<null|any>} The fetched data as a JSON object, or null if an error occurred.
 */
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


/**
 * Posts data to the Firebase Realtime Database.
 * @param {string} [path="users"] The path in the database to post data to.
 * @param {Object} [data={}] The data to be posted.
 * @return {Promise<any>} The response from the server as a JSON object.    
 */
async function postData(path, data) {
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



