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
            mkGuild: ['<name>'],
            rmGuild: ['<guildID>'],
            delGuild: ['<guildID> <memberID>'],
            eval: ['<code>']
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
        guild.save();

        log("INFO", `Created guild: ${guild.id}`);
    }

    rmGuild(guildID) {
        const guild = new Guild();
        guild.initWithId(guildID);
        guild.removeMember(this.id);

        log("INFO", `Removed guild: ${guildID} from user: ${this.id}`);
    }

    async addGuild(guildID, userID) {
        const user = new User();
        await user.initWithId(userID);
        await user.addGuild(guildID);

        log("INFO", `Added guild: ${guildID} to user: ${userID}`);
    }

    delGuild(guildID, userID) {
        const user = new User();
        user.initWithId(userID);
        user.removeGuild(guildID);

        log("INFO", `Removed guild: ${guildID} from user: ${userID}`);
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