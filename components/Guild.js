class Guild {
    constructor(creatorID) {
        this.name = "New guild";
        this.id = stealth.id_manager.getNextID();
        this.creatorID = creatorID;

        this.members = [];
    };
};

module.exports = Guild;