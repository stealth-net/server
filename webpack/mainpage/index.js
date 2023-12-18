import { addFriend, addPendingRequest, removeFriend, removeFriendRequest, updateProfile } from './frontend.js';
import { Connection } from './client.js';
import { parseCookies } from './util.js';
const cookies = parseCookies();

window.StealthNet = {
    cookie: cookies,
    connection: new Connection({ token: cookies.token || null })
};

StealthNet.connection.on("fetchedProfile", updateProfile);

StealthNet.connection.net.socket.on("friendRemove", id => removeFriend(id));
StealthNet.connection.net.socket.on("friendRequest", (userData) => addPendingRequest(userData, false));
StealthNet.connection.net.socket.on("friendRequestCancel", (userData) => removeFriendRequest(userData.id));
StealthNet.connection.net.socket.on("friendRequestAccept", userData => {
    addFriend(userData);
    removeFriendRequest(userData.id);
});
StealthNet.connection.net.socket.on("statusChanged", (id, type) => document.getElementById("friend-" + id).querySelector('div.friend-status').setAttribute("state", type));