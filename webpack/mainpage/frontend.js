import { connectionInstance } from "./client.js";
import { formatMessage, formatTimestamp, postData } from "./util.js";

export function addDM(userData) {
    const friendContainer = document.createElement('div');
    friendContainer.classList.add('friend-container');
    friendContainer.setAttribute('state', 'inactive');
    friendContainer.setAttribute('id', userData.id);

    friendContainer.addEventListener('click', () => {
        document.getElementById("dm-messages").innerHTML = ''; // Clear previous messages
        loadInitialMessages(userData.id);
    });

    const containerActions = document.createElement("div");
    containerActions.className = "container-actions";

    const imgElement = document.createElement('img');
    imgElement.width = 46;
    imgElement.height = 46;
    imgElement.src = userData.pfpURL;

    const friendStatus = document.createElement('div');
    friendStatus.classList.add('friend-status');
    friendStatus.setAttribute('state', userData.status);

    const labelElement = document.createElement('label');
    labelElement.textContent = userData.username;

    const button1 = document.createElement("button");
    button1.addEventListener("click", () => {
        friendContainer.remove();
        // Remove from saved opened DMs list
        const activeDMs = JSON.parse(localStorage.getItem('activeDMs') || '[]');
        const newActiveDMs = activeDMs.filter(id => id !== userData.id);
        localStorage.setItem('activeDMs', JSON.stringify(newActiveDMs));
        // Open home tab
        setTimeout(() => {
            document.querySelector('div[tab="home"]').click();
        }, 1);
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
    button1.appendChild(svg2);

    containerActions.appendChild(button1);

    [friendStatus, labelElement, friendContainer].forEach(element => {
        element.addEventListener("click", () => {
            tabContents.forEach(content => {
                content.hidden = true;
            });
            lsideButtons.forEach(button => {
                button.removeAttribute("state");
            });
            element.setAttribute("state", "active");

            document.querySelector("div.dm-user").hidden = false;

            document.getElementById("user-message-content").placeholder = "Message @" + userData.username;
        });
    });

    friendContainer.appendChild(imgElement);
    friendContainer.appendChild(friendStatus);
    friendContainer.appendChild(labelElement);
    friendContainer.appendChild(containerActions);

    document.getElementById("dm-list").appendChild(friendContainer);

    // Save the DM ID to localStorage immediately after adding to the list
    let activeDMs = JSON.parse(localStorage.getItem('activeDMs') || '[]');
    if (!activeDMs.includes(userData.id)) {
        activeDMs.push(userData.id);
        localStorage.setItem('activeDMs', JSON.stringify(activeDMs));
    }
}

export function addFriend(userData) {
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

    const containerActions = document.createElement("div");
    containerActions.className = "container-actions";

    // message
    const button1 = document.createElement("button");
    button1.addEventListener("click", () => {
        const dmContainer = document.getElementById("dm-list");
        const existingDM = dmContainer.querySelector(`#friend-${userData.id}`);
        if (existingDM && !existingDM.hidden) {
            existingDM.hidden = false; // Ensure the DM is visible
        } else {
            addDM(userData);
        }
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
        removeFriend(userData.id);
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
    friendContainer.appendChild(containerActions);
    
    containerActions.appendChild(button1);
    containerActions.appendChild(button2);

    document.getElementById("friend-list").appendChild(friendContainer);
}

export function addPendingRequest(userData, ownRequest) {
    const friendContainer = document.createElement("div");
    friendContainer.id = "request-" + userData.id;
    friendContainer.className = "friend-container";

    const img = document.createElement("img");
    img.width = 64;
    img.height = 64;
    img.src = userData.pfpURL;

    const label = document.createElement("label");
    label.style.margin = "0px 0px 0px 3px";
    label.textContent = userData.username;

    const containerActions = document.createElement("div");
    containerActions.className = "container-actions";

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
    friendContainer.appendChild(containerActions);

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

        containerActions.appendChild(button1);
    }
    containerActions.appendChild(button2);

    document.getElementById("pending-list").appendChild(friendContainer);
}

export function removeFriend(id) {
    if(document.getElementById("friend-" + id)) document.getElementById("friend-" + id).remove();
}

export function removeFriendRequest(id) {
    if(document.getElementById("request-" + id)) document.getElementById("request-" + id).remove();
}

export function addGuild(GuildID) {
    const imgElement = document.createElement('img');
    imgElement.classList.add("guildlist-logo");
    imgElement.src = "./images/logo_transparent.png";

    document.getElementById("guild-list").appendChild(imgElement);
}

export function addMessage(messageData) {
    var messageContainer = document.createElement("div");
    messageContainer.className = "message-container";

    var img = document.createElement("img");
    img.src = messageData.author.pfpURL;
    img.width = 45;
    img.height = 45;

    var authorDiv = document.createElement("div");
    authorDiv.className = "message-author";

    var usernameLabel = document.createElement("label");
    usernameLabel.textContent = messageData.author.username;

    var timestampLabel = document.createElement("label");
    timestampLabel.textContent = formatTimestamp(messageData.creationTime);

    var messageGroupDiv = document.createElement("div");
    messageGroupDiv.className = "message-group";

    authorDiv.appendChild(usernameLabel);
    authorDiv.appendChild(timestampLabel);

    if(messageData.content) {
        var messageLabel = document.createElement("label");
        messageLabel.innerHTML = formatMessage(messageData.content);

        messageGroupDiv.appendChild(messageLabel);
    }

    if(messageData.attachments && messageData.attachments.length > 0) {
        messageData.attachments.forEach(attachment => {
            if(/\.(jpeg|jpg|gif|png)$/.test(attachment.url)) {
                var attachmentImg = document.createElement("img");
                attachmentImg.src = attachment.url;
                attachmentImg.style.maxWidth = "520px";
                attachmentImg.style.maxHeight = "260px";
                attachmentImg.style.marginTop = "3px";
                messageGroupDiv.appendChild(attachmentImg);
            } else {
                // For non-image attachments or other future implementations
                var attachmentLink = document.createElement("a");
                attachmentLink.href = attachment.url;
                attachmentLink.textContent = attachment.filename;
                attachmentLink.style.marginTop = "3px";
                messageGroupDiv.appendChild(attachmentLink);
            }
        });
    }

    messageContainer.appendChild(img);
    messageContainer.appendChild(authorDiv);
    messageContainer.appendChild(messageGroupDiv);

    document.getElementById("dm-messages").appendChild(messageContainer);
    
    document.getElementById("dm-messages").scrollTop = document.getElementById("dm-messages").scrollHeight; // Auto-scroll to the bottom of the message container
}

export function updateProfile() {
    const profile = document.querySelectorAll("#side-user-menu label");

    profile[0].innerText = StealthNet.connection.user.username;
    profile[2].innerText = formatTimestamp(StealthNet.connection.user.creationTime);

    document.querySelector("#side-user-menu img").src = StealthNet.connection.user.pfpURL;

    StealthNet.connection.user.friends.forEach(async userData => {
        addFriend(userData);
    });

    StealthNet.connection.user.friendRequests.forEach(userData => {
        addPendingRequest(userData, false);
    });
    
    StealthNet.connection.user.friendRequestsOwn.forEach(userData => {
        addPendingRequest(userData, true);
    });
}

document.getElementById("friend-add").addEventListener("click", async () => {
    const userData = await postData("/user-api/v1/add-friend", { username: document.getElementById("friend-username").value }, "POST");

    if(userData)
        addPendingRequest(userData, true);
});

function enterAction(text, attachments = []) {
    addMessage({
        author: { username: StealthNet.connection.user.username, pfpURL: StealthNet.connection.user.pfpURL },
        content: text,
        creationTime: Date.now(),
        attachments: attachments // Add this line
    });
    document.getElementById("user-message-content").value = ''; // Clear the input field
    document.getElementById("dm-messages").scrollTop = document.getElementById("dm-messages").scrollHeight; // Auto-scroll to the bottom of the message container
}

function isdmChat() {
    return document.querySelector("div.dm-user").hidden === false;
}

function getRecipientID() {
    const activeFriendContainer = document.querySelector("#dm-list > .friend-container[state='active']");
    return activeFriendContainer ? activeFriendContainer.getAttribute('id') : null;
}

document.getElementById("user-message-content").addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey && isdmChat()) {
        event.preventDefault();
        const messageContent = document.getElementById("user-message-content").value.trim();

        if (messageContent) {
            const recipientId = getRecipientID();

            if (recipientId) {
                postData("/user-api/v1/send-message", { recipientId, text: messageContent }, "POST")
                    .then(() => enterAction(messageContent))
                    .catch(error => console.error("Error sending message:", error));
            }
        }
    }
});

document.getElementById("dm-send-message").addEventListener("click", event => {
    event.preventDefault();
    if (isdmChat()) {
        const messageContent = document.getElementById("user-message-content").value.trim();

        if (messageContent) {
            const recipientId = getRecipientID();

            if (recipientId) {
                postData("/user-api/v1/send-message", { recipientId, text: messageContent }, "POST")
                    .then(() => enterAction(messageContent))
                    .catch(error => console.error("Error sending message:", error));
            }
        }
    }
});

const subTabContents = document.querySelectorAll('[class^="midsubtab-"]');
const tabContents = document.querySelectorAll("#menu-mid > div");
const tabButtons = document.querySelectorAll(".mid-tabbutton");
const lsideButtons = document.querySelectorAll(".lside-button");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tabValue = button.getAttribute("tab");

        tabButtons.forEach(_button => {
            _button.removeAttribute("state");
        });

        button.setAttribute("state", "active");

        subTabContents.forEach(content => {
            content.hidden = true;
        });

        const selectedTabContent = document.querySelector(`.midsubtab-${tabValue}`);
        if(selectedTabContent) selectedTabContent.hidden = false;
    });
});

lsideButtons.forEach(lsideButton => {
    lsideButton.addEventListener("click", function () {
        const tabValue = lsideButton.getAttribute("tab");

        lsideButtons.forEach(_button => {
            _button.removeAttribute("state");
        });

        document.querySelectorAll("#dm-list > div").forEach(_dm => {
            _dm.removeAttribute("state");
        });

        document.getElementById("dm-messages").innerHTML = '';

        lsideButton.setAttribute("state", "active");

        tabContents.forEach(content => {
            content.hidden = true;
        });

        const selectedTabContent = document.querySelector(`.midtab-${tabValue}`);
        if(selectedTabContent) selectedTabContent.hidden = false;
    });
});

function switchMenu(menuType) {
    const userMenu = document.querySelectorAll('.side-user-menu');
    const serverMenu = document.querySelectorAll('.side-server-menu');

    userMenu.forEach(menu => menu.style.display = menuType === 'user' ? 'block' : 'none');
    serverMenu.forEach(menu => menu.style.display = menuType === 'server' ? 'block' : 'none');
}

document.getElementById("dm-attachfile").addEventListener("click", () => {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("recipientId", getRecipientID());

        fetch("/user-api/v1/upload-file", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            enterAction(null, [data.file]); // Pass null for text and the file data as attachments
        })
        .catch(error => console.error("Error uploading file:", error));
    }
});

document.getElementById("dm-messages").addEventListener("scroll", async function() {
    if(this.scrollTop === 0) {
        await loadMoreMessages();
    }
});

function loadInitialMessages(recipientId) {
    fetch(`/user-api/v1/get-messages?recipientId=${recipientId}&start=0&end=20`)
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                // Messages are sorted oldest to newest
                data.messages.forEach(message => addMessage(message));
                // Scroll to the bottom to show the most recent messages
                const messageContainer = document.getElementById("dm-messages");
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }
        })
        .catch(error => console.error("Error loading messages:", error));
}

async function loadMoreMessages() {
    const currentMessagesCount = document.querySelectorAll(".message-container").length;
    const recipientId = getRecipientID();
    if (recipientId) {
        const oldScrollHeight = document.getElementById("dm-messages").scrollHeight;
        const response = await fetch(`/user-api/v1/get-messages?recipientId=${recipientId}&start=${currentMessagesCount}&end=${currentMessagesCount + 20}`);
        const data = await response.json();
        if(data.messages) {
            data.messages.forEach(message => {
                addMessageAtTop(message);
            });
        }
        const newScrollHeight = document.getElementById("dm-messages").scrollHeight;
        document.getElementById("dm-messages").scrollTop += newScrollHeight - oldScrollHeight;
        if(!data.hasMore) {
            document.getElementById("dm-messages").removeEventListener("scroll", loadMoreMessages);
        }
    }
}

function addMessageAtTop(messageData) {
    var messageContainer = document.createElement("div");
    messageContainer.className = "message-container";

    var img = document.createElement("img");
    img.src = messageData.author.pfpURL;
    img.width = 45;
    img.height = 45;

    var authorDiv = document.createElement("div");
    authorDiv.className = "message-author";

    var usernameLabel = document.createElement("label");
    usernameLabel.textContent = messageData.author.username;

    var timestampLabel = document.createElement("label");
    timestampLabel.textContent = formatTimestamp(messageData.creationTime);

    var messageGroupDiv = document.createElement("div");
    messageGroupDiv.className = "message-group";

    authorDiv.appendChild(usernameLabel);
    authorDiv.appendChild(timestampLabel);

    if(messageData.content) {
        var messageLabel = document.createElement("label");
        messageLabel.innerHTML = formatMessage(messageData.content);

        messageGroupDiv.appendChild(messageLabel);
    }

    if(messageData.attachments && messageData.attachments.length > 0) {
        messageData.attachments.forEach(attachment => {
            if(/\.(jpeg|jpg|gif|png)$/.test(attachment.url)) {
                var attachmentImg = document.createElement("img");
                attachmentImg.src = attachment.url;
                attachmentImg.style.maxWidth = "520px";
                attachmentImg.style.maxHeight = "260px";
                attachmentImg.style.marginTop = "3px";
                messageGroupDiv.appendChild(attachmentImg);
            } else {
                // For non-image attachments or other future implementations
                var attachmentLink = document.createElement("a");
                attachmentLink.href = attachment.url;
                attachmentLink.textContent = attachment.filename;
                attachmentLink.style.marginTop = "3px";
                messageGroupDiv.appendChild(attachmentLink);
            }
        });
    }

    messageContainer.appendChild(img);
    messageContainer.appendChild(authorDiv);
    messageContainer.appendChild(messageGroupDiv);

    const dmMessages = document.getElementById("dm-messages");
    dmMessages.insertBefore(messageContainer, dmMessages.firstChild);
}

document.querySelector("#user-menu > div.centered > img").addEventListener("dblclick", function() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function(event) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                fetch("/user-api/v1/edit-pfp", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pfpURL: imageData }),
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(data => {
                    if (data && data.pfpURL) document.querySelector("#user-menu > div.centered > img").src = data.pfpURL;
                })
                .catch(error => console.error("Error updating profile picture:", error));
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    fileInput.click();
    document.body.appendChild(fileInput);

    fileInput.addEventListener("click", function(event) {
        event.stopPropagation();
    }, { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sliders
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        const sliderValueDisplay = slider.querySelector('.slider-value');

        slider.oninput = function() {
            sliderValueDisplay.textContent = slider.querySelector('.slider').value;
        }
    });
    // Load active DMs from localStorage
    connectionInstance.on("fetchedProfile", () => {
        const activeDMs = JSON.parse(localStorage.getItem('activeDMs') || '[]');
        activeDMs.forEach(id => {
            const userData = connectionInstance.user.friends.find(friend => friend.id === id);
            if (userData) {
                addDM(userData);
            }
        });
    });
});