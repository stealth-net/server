class Guild {
    constructor(creatorID) {
        this.name = "New guild";
        this.id = stealth.id_manager.getNextID();
        this.ownerID = creatorID;
        this.channels = [];
        this.roles = [];
        this.emojis = [];
        this.members = [];
        this.maxMembers = 16;
    }

    addMember(member) {
        if (this.members.length < this.maxMembers) {
            this.members.push(member);
        }
    }
}

module.exports = Guild;