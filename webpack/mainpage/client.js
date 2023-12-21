import { getData } from "./util.js";

export class Connection extends EventEmitter {
    constructor(options = {}) {
        super();

        this.options = options;

        getData("/user-api/v1/get-me").then(response => {
            this.user = response;
            this.emit("fetchedProfile", response);
        });

        this.net = {
            socket: io()
        };
    };
};