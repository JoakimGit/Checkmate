let player;

(function getLoggedInUser() {
    fetch("/login/logged-in-user")
    .then(response => response.json())
    .then(data => player = data.username);
})();