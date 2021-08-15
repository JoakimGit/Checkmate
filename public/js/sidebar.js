let username;

function getLoggedInUser() {
    fetch("/login/logged-in-user")
    .then(response => response.json())
    .then(data => {
        username = data.username;
        $("#username").text(username);
    });
};

jQuery(function() {
    getLoggedInUser();

    $("#games").on("click", function(event) {
        event.preventDefault();
        window.location.href = `/games/overview/${username}`;
    });
});