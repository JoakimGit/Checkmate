jQuery(function() {
    $("#signup").on("click", function() {        
        const noRequiredError = validateRequiredInput();        
        const noPassError = comparePasswords();
        const noUsernameError = checkIfUserExists();
        if (noRequiredError && noPassError && noUsernameError) {
            $("#register-form").trigger("submit");
        }
    });
});

function validateRequiredInput() {
    const inputFields = ["username", "email", "password", "confirmPassword"];
    let isSuccess = true;
    inputFields.forEach(field => {
        const result = checkRequiredFieldPresent(field);
        if (!result) isSuccess = false;
    });
    return isSuccess;
}

function checkRequiredFieldPresent(field) {    
    $(`#${field}-error`).text("");
    fieldValue = $(`#${field}`).val();

    if (!fieldValue) {
        $(`#${field}-error`).text(`${capitalizeFirstLetter(field)} required`);
        $(`#${field}-error`).show();
        return false;
    }
    return true;
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
        return false;
    }
    return true;
}

async function getUserByName(username) {
    let response = await fetch(`/users/${username}`);
    let user = await response.json();
    return user;
}

async function checkIfUserExists() {
    const username = $("#username").val(); 
    if (username) {
        const userFromServer = await getUserByName(username);

        if (jQuery.isEmptyObject(userFromServer)) {
            return true;
        } else {
            $("#username-error").text("This username is already taken");
            $("#username-error").show();
            return false;
        }
    }    
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}