import { addFriend, addMessage, addPendingRequest, removeFriend, removeFriendRequest, updateProfile } from './frontend.js';
import { getData, parseCookies } from "./util.js";
import config from "./config.js";

const cookies = parseCookies();

export class Connection extends EventEmitter {
    constructor(options = {}) {
        super();

        this.options = options;

        getData("/user-api/v1/get-me").then(response => {
            this.user = response;
            this.emit("fetchedProfile", response);
        });

        this.net = {
            socket: io({ extraHeaders: { saveMessages: config.getValue("save-messages") } })
        }

        const socket = this.net.socket;
        this.on("fetchedProfile", updateProfile);

        socket.on("friendRemove", id => removeFriend(id));
        socket.on("friendRequest", userData => addPendingRequest(userData, false));
        socket.on("friendRequestCancel", userData => removeFriendRequest(userData.id));
        socket.on("friendRequestAccept", userData => addFriend(userData));
        socket.on("newMessage", messageData => addMessage(messageData));
        socket.on("statusChanged", (id, type) => document.getElementById("friend-" + id).querySelector('div.friend-status').setAttribute("state", type));
    }
}

export const connectionInstance = new Connection({ token: cookies.token || null });