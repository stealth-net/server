const chalk = require('chalk');

if(false) {
    chalk.blue = chalk.blueBright;
    chalk.red = chalk.redBright;
    chalk.green = chalk.greenBright;
    chalk.yellow = chalk.yellowBright;
    chalk.magenta = chalk.magentaBright;
};

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
};
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

function log(...message) {
    const type = message[message.length - 1];
    message.pop();
    message = message.join(" ");

	let dt = new Date();

    msg = chalk.blue('[' + dt.timeNow() + ` ${type}]: `) + chalk.white(message);

	console.log(msg);
};

module.exports = log;