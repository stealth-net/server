const { User, querySearch } = require("../../../components/User.js");
const { log } = require("../../../utils/log.js");
const sendStatusIf = require("../../../utils/resStatus.js");

function isValidInput(input, options = { maxLength: 20, allowSpecialCharacters: false }) {
    const maxLength = options.maxLength || 20;
    const regex = /^[a-zA-Z0-9@.]+$/;
    if (input.length > maxLength) {
        return { valid: false, reason: "Input exceeds maximum length." };
    }
    if (!regex.test(input) && !options.allowSpecialCharacters) {
        return { valid: false, reason: "Input contains invalid characters." };
    }
    return { valid: true };
}

module.exports = async (req, res) => {
    const { username, email, password } = req.body;

    const usernameValidation = isValidInput(username, { maxLength: 16, allowSpecialCharacters: false });
    const emailValidation = isValidInput(email, { maxLength: 320, allowSpecialCharacters: false });

    if (!usernameValidation.valid || !emailValidation.valid) {
        return res.status(400).send(usernameValidation.reason || emailValidation.reason);
    }

    if (sendStatusIf(res, await querySearch(username, "username"), 409, "Username already registered")) return;
    if (sendStatusIf(res, await querySearch(email, "email"), 409, "Email already registered")) return;

    const user = new User();
    user.init({
        username: username,
        email: email,
        password: password
    });
    user.save();

    log("AUTH", `User ${user.id} signed up`);

    res.cookie("token", user.token);
    res.sendStatus(200);
}