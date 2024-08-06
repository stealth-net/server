const chalk = require("chalk");

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

/**
 * Logs messages with a specified type.
 * @param {string} type - The type of the log (INFO, WARN, ERROR, DEBUG, AUTH, USERS).
 * @param {...string} message - The messages to log.
*/
function log(type, ...message) {
    type = type.toUpperCase();
    if(!stealth.config.logging[type.toLowerCase()]) return;

    const date = new Date();
    let typeColor;
    switch (type) {
        case "INFO":
            typeColor = chalk.blue;
            break;
        case "WARN":
            typeColor = chalk.yellow;
            break;
        case "ERROR":
            typeColor = chalk.red;
            break;
        case "DEBUG":
            typeColor = chalk.magenta;
            break;
        case "AUTH":
            typeColor = chalk.green;
            break;
        case "USERS":
            typeColor = chalk.green;
            break;
        default:
            typeColor = chalk.blue;
            break;
    }

    const formattedMessage = message.join(' ');
    const logMessage = `${typeColor(`[${date.timeNow()} ${type}]:`)} ${chalk.white(formattedMessage)}`;

    console.log(logMessage);
    stealth.io.to("admin").emit("log", { type, message });
}

/**
 * Parses the cookie header string into an object of key-value pairs.
 * @param {string} cookieHeader - The raw cookie header string.
 * @returns {Object} An object where each key-value pair corresponds to a cookie name and its decoded value.
 */
const parseCookies = cookieHeader => {
    if (!cookieHeader) return {};
    return cookieHeader.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});
}

module.exports = { log, parseCookies };