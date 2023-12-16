document.getElementById("friend-add").addEventListener("click", async () => {
    const userData = await postData("/user-api/v1/add-friend", { username: document.getElementById("friend-username").value }, "POST");

    if(userData)
        addPendingRequest(userData, true);
});