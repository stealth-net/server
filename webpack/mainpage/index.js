import { addFriend, addMessage, addPendingRequest, removeFriend, removeFriendRequest, updateProfile } from './frontend.js';
import { Connection } from './client.js';
import { parseCookies } from './util.js';
const cookies = parseCookies();

window.StealthNet = {
    cookie: cookies,
    connection: new Connection({ token: cookies.token || null })
}

const socket = StealthNet.connection.net.socket;
StealthNet.connection.on("fetchedProfile", updateProfile);

socket.on("friendRemove", id => removeFriend(id));
socket.on("friendRequest", userData => addPendingRequest(userData, false));
socket.on("friendRequestCancel", userData => removeFriendRequest(userData.id));
socket.on("friendRequestAccept", userData => addFriend(userData));
socket.on("newMessage", messageData => addMessage(messageData));
socket.on("statusChanged", (id, type) => document.getElementById("friend-" + id).querySelector('div.friend-status').setAttribute("state", type));