import "./getDashboard.js";

import { getData, formatTimestamp } from "./frontend.js";

document.getElementById("user-search").addEventListener("keydown", async event => {
    if(event.key == "Enter" && document.getElementById("user-search").value.trim() !== '') {
        const userData = await getData("/admin-api/v1/get-user/" + document.getElementById("user-search").value);
        document.getElementById("user-search").value = '';

        // Display the user data
        document.getElementById("user-pfp").src = userData.pfpURL;
        document.getElementById("user-username").innerText = userData.username
        document.getElementById("user-creationtime").innerText = formatTimestamp(userData.creationTime);

        // Special properties
        document.getElementById("user-prop-id").innerText = userData.id;
        document.getElementById("user-prop-displayname").innerText = userData.display_name;
        document.getElementById("user-prop-email").innerText = userData.email;
        document.getElementById("user-prop-token").innerText = userData.token;

        const friendsTable = document.getElementById("user-friends");

        // Load friends
        // Clear previous entries
        while(friendsTable.rows.length > 1) {
            friendsTable.deleteRow(1);
        }
        if(userData.friends && userData.friends.length > 0) {
            userData.friends.forEach(async _friend => {
                const friendData = await getData("/admin-api/v1/get-user/" + _friend.id);
                const row = friendsTable.insertRow();
                const cellId = row.insertCell(0);
                const cellName = row.insertCell(1);
                const cellEmail = row.insertCell(2);

                cellId.innerText = friendData.id;
                cellName.innerHTML = `<img src="${friendData.pfpURL}" width="30" height="30" style="border-radius: 50%;"> ${friendData.username}`;
                cellEmail.innerText = friendData.email;
            });
        }
    }
});

// Admin socket
const socket = io();

socket.on("connect", () => {
    console.log("Connected to the server");
    socket.emit("registerAdmin");
});

socket.on("log", data => {
    document.getElementById("system-logs").value += `[${data.type}] ${data.message}\n`;
});

socket.on("notAdmin", () => {
    alert("You are not an admin.");
    location.href = "/";
});