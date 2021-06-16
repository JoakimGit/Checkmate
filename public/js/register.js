async function getUserByName(username) {
    let response = await fetch(`/users/${username}`);
    let user = await response.json();
    return user;
}

jQuery(function() {
    $("#signup").on("click", function() {        
        validateRequiredInput();        
        comparePasswords();
        checkIfUserExists();
        $("#register-form").trigger("submit");
    });
});

function validateRequiredInput() {
    const inputFields = ["username", "email", "password", "confirmPassword"];
    inputFields.forEach(field => checkRequiredFieldPresent(field));
}


function checkRequiredFieldPresent(field) {    
    $(`#${field}-error`).text("");
    fieldValue = $(`#${field}`).val();

    if (!fieldValue) {
        $(`#${field}-error`).text(`${capitalizeFirstLetter(field)} required`);
        $(`#${field}-error`).show();
    }
}

function comparePasswords() {
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    if (password !== confirmPassword) {
        if ($("#password-error").text().length > 1) {
            $("#password-error").append("<br>");
        } 
        $("#password-error").append("Passwords don't match");

        if ($("#confirmPassword-error").text().length > 1) {
            $("#confirmPassword-error").append("<br>");
        }  
        $("#confirmPassword-error").append("Passwords don't match");
    }
}

async function checkIfUserExists() {
    const username = $("#username").val(); 
    if (username) {
        const userFromServer = await getUserByName(username);

        if (jQuery.isEmptyObject(userFromServer)) {
            return false
        } else {
            $("#username-error").text("This username is already taken");
            $("#username-error").show();
        }
    }    
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}