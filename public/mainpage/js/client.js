io = io(null);

io.on("friendRemove", username => {
    removeFriend(username);
});
io.on("friendRequest", userData => {
    addPendingRequest(userData.username, userData.pfpURL, false);
});
io.on("friendRequestCancel", username => {
    removeFriendRequest(username);
});
io.on("friendRequestAccept", userData => {
    addFriend(userData.username, userData.pfpURL, userData.status);
    removeFriendRequest(userData.username);
});