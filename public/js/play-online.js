function getLoggedInUser() {
    fetch("/login/logged-in-user")
    .then(response => response.json())
    .then(data => {
         player = data.username
         $("#username").text(player);
    });         
};

jQuery(function() {
    getLoggedInUser();

    $("#games").on("click", function(event) {
        event.preventDefault();
        window.location.href = `/games/overview/${player}`;
    });
});

