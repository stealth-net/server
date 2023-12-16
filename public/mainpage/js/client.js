io = io(null);

io.on("friendRemove", id => {
    removeFriend(id);
});
io.on("friendRequest", userData => {
    addPendingRequest(userData, false);
});
io.on("friendRequestCancel", id => {
    removeFriendRequest(id);
});
io.on("friendRequestAccept", userData => {
    addFriend(userData);
    removeFriendRequest(userData.id);
});
io.on("statusChanged", (id, status) => {
    console.log(id, status);
});