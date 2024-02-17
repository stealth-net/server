const chalk = require("chalk");
const log = require("./log.js");

const { promote_badge, demote_badge } = require("../components/Badge.js");

class Command {
    constructor(message) {
        const parts = message.split(' ');
        this.cmd = parts.shift();
        this.args = parts;
        this.text = parts.join(' ');

        if (typeof this[this.cmd] === "function") {
            this[this.cmd](...this.args);
        }
    }

    help() {
        const commands = {
            help: [],
            promote: ['<id> <badgeID>'],
            demote: ['<id> <badgeID>']
        }

        log("INFO", "Command List:");
        Object.entries(commands).forEach(([command, params], index) => {
            console.log(chalk.blue(`${index + 1}. `) + chalk.white(`${command} ${params.join(' ')}`));
        });
    }

    promote(id, badgeID) {
        console.log("Promoting user:", id, "to badge:", badgeID);
        
        promote_badge(id, badgeID);
    }

    demote(id, badgeID) {
        console.log("Demoting user:", id, "from badge:", badgeID);
        
        demote_badge(id, badgeID);
    }
}

module.exports = Command;