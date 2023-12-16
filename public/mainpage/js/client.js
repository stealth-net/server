io = io(null);

io.on("friendRemove", id => {
    removeFriend(id);
});
io.on("friendRequest", (userData) => {
    addPendingRequest(userData, false);
});
io.on("friendRequestCancel", (userData) => {
    removeFriendRequest(userData.id)
});
io.on("friendRequestAccept", userData => {
    addFriend(userData);
    removeFriendRequest(userData.id);
});
io.on("statusChanged", (id, type) => {
    document.getElementById("friend-" + id).querySelector('div.friend-status').setAttribute("state", type);
});