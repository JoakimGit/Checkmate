jQuery(function() {
    $("#login").on("click", function() {        
        const noRequiredError = validateRequiredInput();
        if (noRequiredError) {
            console.log("Submitting login form");
            $("#login-form").trigger("submit");
        }
    });
});

function validateRequiredInput() {
    const inputFields = ["username", "password"];
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

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}