const chalk = require("chalk");
const { log } = require("./log.js");

const { promote_badge, demote_badge } = require("../components/Badge.js");
const { User } = require("../components/User.js");
const Guild = require("../components/Guild.js");

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
            demote: ['<id> <badgeID>'],
            addGuild: ['<guildID> <memberID>'],
            mkGuild: ['<name>']
        }

        log("INFO", "Command List:");
        Object.entries(commands).forEach(([command, params], index) => {
            console.log(chalk.blue(`${index + 1}. `) + chalk.white(`${command} ${params.join(' ')}`));
        });
    }

    promote(id, badgeID) {
        log("INFO", `Promoting user: ${id} to badge: ${badgeID}`);
        
        promote_badge(id, badgeID);
    }

    demote(id, badgeID) {
        log("INFO", `Demoting user: ${id} from badge: ${badgeID}`);
        
        demote_badge(id, badgeID);
    }

    async mkGuild(name) {
        const guild = new Guild();
        await guild.initWithName(name);

        log("INFO", `Created guild: ${guild.id}`);
    }

    async addGuild(guildID, userID) {
        const user = new User();
        await user.initWithID(userID);
        await user.addGuild(guildID);

        log("INFO", `Added guild: ${guildID} to user: ${userID}`);
    }

    eval(code) {
        try {
            eval(code);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Command;