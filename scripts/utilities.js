function logout() {
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('allTasks');
    window.location.href = "../index.html";
}