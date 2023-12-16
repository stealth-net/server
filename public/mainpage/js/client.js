io = io(null);

io.on("friendRequest", userData => {
    addPendingRequest(userData.username, userData.pfpURL, true);
});
io.on("friendRequestCancel", username => {
    document.querySelectorAll("#pending-list > div > label").forEach(element => {
        if(element.innerText == username) element.parentNode.remove()
    });
});