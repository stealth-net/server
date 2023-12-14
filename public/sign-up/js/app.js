const $usernameField = document.getElementById("username");
const $emailField = document.getElementById("email");
const $passwordField = document.getElementById("password");

document.getElementById("sign-button").addEventListener("click", () => {
    if($usernameField.value == '' || $emailField.value == '' || $passwordField.value == '') return;
    fetch("/auth-api/v1/sign-up", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: $usernameField.value,
            email: $emailField.value,
            password: $passwordField.value
        })
    }).then(() => location.pathname = '/');
});