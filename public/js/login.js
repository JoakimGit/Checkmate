jQuery(function () {
  $("#login").on("click", function () {
    const noRequiredError = validateRequiredInput();
    if (noRequiredError) {
      $("#login-form").trigger("submit");
    }
  });

  $("#guestLogin").on("click", function () {
    fetch("/login/guest", {
      method: "POST"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) window.location.href = "/";
      });
  });
});

function validateRequiredInput() {
  const inputFields = ["username", "password"];
  let isSuccess = true;
  inputFields.forEach((field) => {
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
