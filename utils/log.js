const chalk = require('chalk');

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function log(message, type) {
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

    message = `${typeColor(`[${date.timeNow()} ${type}]:`)} ${chalk.white(message)}`;

    console.log(message);
}

module.exports = log;