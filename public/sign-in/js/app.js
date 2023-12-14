const $emailField = document.getElementById("email");
const $passwordField = document.getElementById("password");

document.getElementById("sign-button").addEventListener("click", () => {
    if($emailField.value == '' || $passwordField.value == '') return;
    fetch("/auth-api/v1/sign-in", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: $emailField.value,
            password: $passwordField.value
        })
    }).then(() => location.pathname = '/');
});