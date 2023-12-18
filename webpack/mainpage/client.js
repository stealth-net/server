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
            /**
            * The Socket.IO client instance for handling real-time communication.
            * @type {WebSocket}
            */
            socket: io()
        };
    };
};