async function getData(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300) {
                let jsonResponse;

                try {
                    jsonResponse = JSON.parse(xhr.responseText);
                } catch(error) {
                    resolve(xhr.responseText);
                    return;
                };

                resolve(jsonResponse);
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            };
        };

        xhr.onerror = () => {
            reject(new Error('Network request failed'));
        };

        xhr.send();
    });
};

async function postData(url, data, method) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300) {
                let jsonResponse;

                try {
                    jsonResponse = JSON.parse(xhr.responseText);
                } catch(error) {
                    resolve(xhr.responseText);
                    return;
                };

                resolve(jsonResponse);
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            };
        };

        xhr.onerror = () => {
            reject(new Error('Network request failed'));
        };

        const requestData = typeof data === 'object' ? JSON.stringify(data) : data;

        if(typeof data === "object")
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if(typeof data === "string")
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");

        xhr.send(requestData);
    });
};

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `[${year}-${month}-${day}] ${hours}:${minutes}:${seconds}`;
};

function addDM(username, pfpURL, status) {
    const friendContainer = document.createElement('div');
    friendContainer.classList.add('friend-container');
    friendContainer.setAttribute('state', 'inactive');

    const imgElement = document.createElement('img');
    imgElement.width = 46;
    imgElement.height = 46;
    imgElement.src = pfpURL;

    const friendStatus = document.createElement('div');
    friendStatus.classList.add('friend-status');
    friendStatus.setAttribute('state', status);

    const labelElement = document.createElement('label');
    labelElement.textContent = username;

    friendContainer.appendChild(imgElement);
    friendContainer.appendChild(friendStatus);
    friendContainer.appendChild(labelElement);

    document.getElementById("dm-list").appendChild(friendContainer);
};

function addFriend(userData) {
    const friendContainer = document.createElement("div");
    friendContainer.id = "friend-" + userData.id;
    friendContainer.className = "friend-container";

    const img = document.createElement("img");
    img.setAttribute("width", "64");
    img.setAttribute("height", "64");
    img.setAttribute("src", userData.pfpURL);

    const friendStatus = document.createElement("div");
    friendStatus.className = "friend-status";
    friendStatus.setAttribute("state", userData.status);

    const label = document.createElement("label");
    label.textContent = userData.username;

    const requestActions = document.createElement("div");
    requestActions.className = "request-actions";

    // message
    const button1 = document.createElement("button");
    button1.addEventListener("click", () => {
        addDM(userData.username, userData.pfpURL, userData.status);
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "23");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 23 18");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6.83333 8H6.845M11.5 8H11.5117M16.1667 8H16.1783M22 17L18.1216 15.3378C17.8276 15.2118 17.6806 15.1488 17.5265 15.1044C17.3898 15.065 17.249 15.0365 17.1061 15.0193C16.9451 15 16.7807 15 16.452 15H4.73333C3.42654 15 2.77315 15 2.27402 14.782C1.83497 14.5903 1.47802 14.2843 1.25432 13.908C1 13.4802 1 12.9201 1 11.8V4.2C1 3.07989 1 2.51984 1.25432 2.09202C1.47802 1.71569 1.83497 1.40973 2.27402 1.21799C2.77315 1 3.42655 1 4.73333 1H18.2667C19.5734 1 20.2269 1 20.726 1.21799C21.165 1.40973 21.522 1.71569 21.7457 2.09202C22 2.51984 22 3.0799 22 4.2V17Z");
    path.setAttribute("stroke", "#51567C");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path);

    button1.appendChild(svg);

    // cross
    const button2 = document.createElement("button");
    button2.addEventListener("click", () => {
        postData("/user-api/v1/remove-friend", { id: userData.id }, "POST");
        friendContainer.remove();
    });

    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute("width", "24");
    svg2.setAttribute("height", "24");
    svg2.setAttribute("viewBox", "0 0 28 22");

    const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line3.setAttribute("x1", "2.41421");
    line3.setAttribute("y1", "1.88596");
    line3.setAttribute("x2", "21.114");
    line3.setAttribute("y2", "20.5858");
    line3.setAttribute("stroke", "#6A4040");
    line3.setAttribute("stroke-width", "4");

    const line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line4.setAttribute("x1", "2.23007");
    line4.setAttribute("y1", "20.3978");
    line4.setAttribute("x2", "21.0421");
    line4.setAttribute("y2", "1.58577");
    line4.setAttribute("stroke", "#6A4040");
    line4.setAttribute("stroke-width", "4");

    svg2.appendChild(line3);
    svg2.appendChild(line4);
    button2.appendChild(svg2);

    friendContainer.appendChild(img);
    friendContainer.appendChild(friendStatus);
    friendContainer.appendChild(label);
    friendContainer.appendChild(requestActions);
    
    requestActions.appendChild(button1);
    requestActions.appendChild(button2);

    document.getElementById("friend-list").appendChild(friendContainer);
};

function addPendingRequest(userData, ownRequest) {
    const friendContainer = document.createElement("div");
    friendContainer.id = "request-" + userData.id;
    friendContainer.className = "friend-container";

    const img = document.createElement("img");
    img.width = 64;
    img.height = 64;
    img.src = userData.pfpURL;

    const label = document.createElement("label");
    label.style.margin = "21px 0px 0px 3px";
    label.textContent = userData.username;

    const requestActions = document.createElement("div");
    requestActions.className = "request-actions";

    // cross
    const button2 = document.createElement("button");
    button2.addEventListener("click", () => {
        if(ownRequest)
            postData("/user-api/v1/cancel-friend-request", { id: userData.id }, "POST");
        else
            postData("/user-api/v1/deny-friend-request", { id: userData.id }, "POST");
        
        friendContainer.remove();
    });

    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute("width", "24");
    svg2.setAttribute("height", "24");
    svg2.setAttribute("viewBox", "0 0 28 22");

    const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line3.setAttribute("x1", "2.41421");
    line3.setAttribute("y1", "1.88596");
    line3.setAttribute("x2", "21.114");
    line3.setAttribute("y2", "20.5858");
    line3.setAttribute("stroke", "#6A4040");
    line3.setAttribute("stroke-width", "4");

    const line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line4.setAttribute("x1", "2.23007");
    line4.setAttribute("y1", "20.3978");
    line4.setAttribute("x2", "21.0421");
    line4.setAttribute("y2", "1.58577");
    line4.setAttribute("stroke", "#6A4040");
    line4.setAttribute("stroke-width", "4");

    svg2.appendChild(line3);
    svg2.appendChild(line4);
    button2.appendChild(svg2);

    friendContainer.appendChild(img);
    friendContainer.appendChild(label);
    friendContainer.appendChild(requestActions);

    if(!ownRequest) {
        // checkmark
        const button1 = document.createElement("button");
        button1.addEventListener("click", () => {
            postData("/user-api/v1/accept-friend-request", { id: userData.id }, "POST");
            friendContainer.remove();
        });

        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute("width", "21");
        svg1.setAttribute("height", "17");
        svg1.setAttribute("viewBox", "0 0 21 17");
        
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", "1.34874");
        line1.setAttribute("y1", "8.52322");
        line1.setAttribute("x2", "8.95535");
        line1.setAttribute("y2", "15.4703");
        line1.setAttribute("stroke", "#4E6A40");
        line1.setAttribute("stroke-width", "4");
        
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", "8.58579");
        line2.setAttribute("y1", "12.9263");
        line2.setAttribute("x2", "19.1924");
        line2.setAttribute("y2", "2.31967");
        line2.setAttribute("stroke", "#4E6A40");
        line2.setAttribute("stroke-width", "4");
        
        svg1.appendChild(line1);
        svg1.appendChild(line2);
        button1.appendChild(svg1);

        requestActions.appendChild(button1);
    };
    requestActions.appendChild(button2);

    document.getElementById("pending-list").appendChild(friendContainer);
};

function removeFriend(id) {
    document.getElementById("friend-" + id).remove();
};

function removeFriendRequest(id) {
    document.getElementById("request-" + id).remove();
};

function addGuild(GuildID) {
    const imgElement = document.createElement('img');
    imgElement.classList.add("guildlist-logo");
    imgElement.src = "./images/logo_transparent.png";

    document.getElementById("guild-list").appendChild(imgElement);
};

async function updateProfile() {
    window.user = await getData("/user-api/v1/get-me");

    const profile = document.querySelectorAll("#side-profile label");

    profile[0].innerText = user.username;
    profile[2].innerText = formatTimestamp(user.creationTime);

    document.querySelector("#side-profile img").src = user.pfpURL;

    window.user.friends.forEach(async userData => {
        addFriend(userData);
    });

    window.user.friendRequests.forEach(userData => {
        addPendingRequest(userData, false);
    });
    
    window.user.friendRequestsOwn.forEach(userData => {
        addPendingRequest(userData, true);
    });
};

updateProfile();    