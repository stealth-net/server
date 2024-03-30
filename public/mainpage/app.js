/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./webpack/mainpage/client.js":
/*!************************************!*\
  !*** ./webpack/mainpage/client.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Connection: () => (/* binding */ Connection)\n/* harmony export */ });\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"./webpack/mainpage/util.js\");\n\r\n\r\nclass Connection extends EventEmitter {\r\n    constructor(options = {}) {\r\n        super();\r\n\r\n        this.options = options;\r\n\r\n        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getData)(\"/user-api/v1/get-me\").then(response => {\r\n            this.user = response;\r\n            this.emit(\"fetchedProfile\", response);\r\n        });\r\n\r\n        this.net = {\r\n            socket: io()\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://stealthnet-server/./webpack/mainpage/client.js?");

/***/ }),

/***/ "./webpack/mainpage/frontend.js":
/*!**************************************!*\
  !*** ./webpack/mainpage/frontend.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addDM: () => (/* binding */ addDM),\n/* harmony export */   addFriend: () => (/* binding */ addFriend),\n/* harmony export */   addGuild: () => (/* binding */ addGuild),\n/* harmony export */   addMessage: () => (/* binding */ addMessage),\n/* harmony export */   addPendingRequest: () => (/* binding */ addPendingRequest),\n/* harmony export */   removeFriend: () => (/* binding */ removeFriend),\n/* harmony export */   removeFriendRequest: () => (/* binding */ removeFriendRequest),\n/* harmony export */   updateProfile: () => (/* binding */ updateProfile)\n/* harmony export */ });\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"./webpack/mainpage/util.js\");\n\r\n\r\nfunction addDM(userData) {\r\n    const friendContainer = document.createElement('div');\r\n    friendContainer.classList.add('friend-container');\r\n    friendContainer.setAttribute('state', 'inactive');\r\n    friendContainer.setAttribute('id', userData.id);\r\n\r\n    friendContainer.addEventListener('click', () => {\r\n        document.getElementById(\"dm-messages\").innerHTML = ''; // Clear previous messages\r\n        loadInitialMessages(userData.id);\r\n    });\r\n\r\n    const containerActions = document.createElement(\"div\");\r\n    containerActions.className = \"container-actions\";\r\n\r\n    const imgElement = document.createElement('img');\r\n    imgElement.width = 46;\r\n    imgElement.height = 46;\r\n    imgElement.src = userData.pfpURL;\r\n\r\n    const friendStatus = document.createElement('div');\r\n    friendStatus.classList.add('friend-status');\r\n    friendStatus.setAttribute('state', userData.status);\r\n\r\n    const labelElement = document.createElement('label');\r\n    labelElement.textContent = userData.username;\r\n\r\n    const button1 = document.createElement(\"button\");\r\n    button1.addEventListener(\"click\", () => {\r\n        friendContainer.remove();\r\n    });\r\n\r\n    const svg2 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"svg\");\r\n    svg2.setAttribute(\"width\", \"24\");\r\n    svg2.setAttribute(\"height\", \"24\");\r\n    svg2.setAttribute(\"viewBox\", \"0 0 28 22\");\r\n\r\n    const line3 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line3.setAttribute(\"x1\", \"2.41421\");\r\n    line3.setAttribute(\"y1\", \"1.88596\");\r\n    line3.setAttribute(\"x2\", \"21.114\");\r\n    line3.setAttribute(\"y2\", \"20.5858\");\r\n    line3.setAttribute(\"stroke\", \"#6A4040\");\r\n    line3.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    const line4 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line4.setAttribute(\"x1\", \"2.23007\");\r\n    line4.setAttribute(\"y1\", \"20.3978\");\r\n    line4.setAttribute(\"x2\", \"21.0421\");\r\n    line4.setAttribute(\"y2\", \"1.58577\");\r\n    line4.setAttribute(\"stroke\", \"#6A4040\");\r\n    line4.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    svg2.appendChild(line3);\r\n    svg2.appendChild(line4);\r\n    button1.appendChild(svg2);\r\n\r\n    containerActions.appendChild(button1);\r\n\r\n    [friendStatus, labelElement, friendContainer].forEach(element => {\r\n        element.addEventListener(\"click\", () => {\r\n            tabContents.forEach(content => {\r\n                content.hidden = true;\r\n            });\r\n            lsideButtons.forEach(button => {\r\n                button.removeAttribute(\"state\");\r\n            });\r\n            element.setAttribute(\"state\", \"active\");\r\n\r\n            document.querySelector(\"div.dm-user\").hidden = false;\r\n\r\n            document.getElementById(\"user-message-content\").placeholder = \"Message @\" + userData.username;\r\n        });\r\n    });\r\n\r\n    friendContainer.appendChild(imgElement);\r\n    friendContainer.appendChild(friendStatus);\r\n    friendContainer.appendChild(labelElement);\r\n    friendContainer.appendChild(containerActions);\r\n\r\n    document.getElementById(\"dm-list\").appendChild(friendContainer);\r\n}\r\n\r\nfunction addFriend(userData) {\r\n    const friendContainer = document.createElement(\"div\");\r\n    friendContainer.id = \"friend-\" + userData.id;\r\n    friendContainer.className = \"friend-container\";\r\n\r\n    const img = document.createElement(\"img\");\r\n    img.setAttribute(\"width\", \"64\");\r\n    img.setAttribute(\"height\", \"64\");\r\n    img.setAttribute(\"src\", userData.pfpURL);\r\n\r\n    const friendStatus = document.createElement(\"div\");\r\n    friendStatus.className = \"friend-status\";\r\n    friendStatus.setAttribute(\"state\", userData.status);\r\n\r\n    const label = document.createElement(\"label\");\r\n    label.textContent = userData.username;\r\n\r\n    const containerActions = document.createElement(\"div\");\r\n    containerActions.className = \"container-actions\";\r\n\r\n    // message\r\n    const button1 = document.createElement(\"button\");\r\n    button1.addEventListener(\"click\", () => {\r\n        addDM(userData);\r\n    });\r\n\r\n    const svg = document.createElementNS(\"http://www.w3.org/2000/svg\", \"svg\");\r\n    svg.setAttribute(\"width\", \"23\");\r\n    svg.setAttribute(\"height\", \"18\");\r\n    svg.setAttribute(\"viewBox\", \"0 0 23 18\");\r\n    svg.setAttribute(\"fill\", \"none\");\r\n\r\n    const path = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\r\n    path.setAttribute(\"d\", \"M6.83333 8H6.845M11.5 8H11.5117M16.1667 8H16.1783M22 17L18.1216 15.3378C17.8276 15.2118 17.6806 15.1488 17.5265 15.1044C17.3898 15.065 17.249 15.0365 17.1061 15.0193C16.9451 15 16.7807 15 16.452 15H4.73333C3.42654 15 2.77315 15 2.27402 14.782C1.83497 14.5903 1.47802 14.2843 1.25432 13.908C1 13.4802 1 12.9201 1 11.8V4.2C1 3.07989 1 2.51984 1.25432 2.09202C1.47802 1.71569 1.83497 1.40973 2.27402 1.21799C2.77315 1 3.42655 1 4.73333 1H18.2667C19.5734 1 20.2269 1 20.726 1.21799C21.165 1.40973 21.522 1.71569 21.7457 2.09202C22 2.51984 22 3.0799 22 4.2V17Z\");\r\n    path.setAttribute(\"stroke\", \"#51567C\");\r\n    path.setAttribute(\"stroke-width\", \"2\");\r\n    path.setAttribute(\"stroke-linecap\", \"round\");\r\n    path.setAttribute(\"stroke-linejoin\", \"round\");\r\n\r\n    svg.appendChild(path);\r\n\r\n    button1.appendChild(svg);\r\n\r\n    // cross\r\n    const button2 = document.createElement(\"button\");\r\n    button2.addEventListener(\"click\", () => {\r\n        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/remove-friend\", { id: userData.id }, \"POST\");\r\n        removeFriend(userData.id);\r\n    });\r\n\r\n    const svg2 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"svg\");\r\n    svg2.setAttribute(\"width\", \"24\");\r\n    svg2.setAttribute(\"height\", \"24\");\r\n    svg2.setAttribute(\"viewBox\", \"0 0 28 22\");\r\n\r\n    const line3 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line3.setAttribute(\"x1\", \"2.41421\");\r\n    line3.setAttribute(\"y1\", \"1.88596\");\r\n    line3.setAttribute(\"x2\", \"21.114\");\r\n    line3.setAttribute(\"y2\", \"20.5858\");\r\n    line3.setAttribute(\"stroke\", \"#6A4040\");\r\n    line3.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    const line4 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line4.setAttribute(\"x1\", \"2.23007\");\r\n    line4.setAttribute(\"y1\", \"20.3978\");\r\n    line4.setAttribute(\"x2\", \"21.0421\");\r\n    line4.setAttribute(\"y2\", \"1.58577\");\r\n    line4.setAttribute(\"stroke\", \"#6A4040\");\r\n    line4.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    svg2.appendChild(line3);\r\n    svg2.appendChild(line4);\r\n    button2.appendChild(svg2);\r\n\r\n    friendContainer.appendChild(img);\r\n    friendContainer.appendChild(friendStatus);\r\n    friendContainer.appendChild(label);\r\n    friendContainer.appendChild(containerActions);\r\n    \r\n    containerActions.appendChild(button1);\r\n    containerActions.appendChild(button2);\r\n\r\n    document.getElementById(\"friend-list\").appendChild(friendContainer);\r\n}\r\n\r\nfunction addPendingRequest(userData, ownRequest) {\r\n    const friendContainer = document.createElement(\"div\");\r\n    friendContainer.id = \"request-\" + userData.id;\r\n    friendContainer.className = \"friend-container\";\r\n\r\n    const img = document.createElement(\"img\");\r\n    img.width = 64;\r\n    img.height = 64;\r\n    img.src = userData.pfpURL;\r\n\r\n    const label = document.createElement(\"label\");\r\n    label.style.margin = \"0px 0px 0px 3px\";\r\n    label.textContent = userData.username;\r\n\r\n    const containerActions = document.createElement(\"div\");\r\n    containerActions.className = \"container-actions\";\r\n\r\n    // cross\r\n    const button2 = document.createElement(\"button\");\r\n    button2.addEventListener(\"click\", () => {\r\n        if(ownRequest)\r\n            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/cancel-friend-request\", { id: userData.id }, \"POST\");\r\n        else\r\n            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/deny-friend-request\", { id: userData.id }, \"POST\");\r\n        \r\n        friendContainer.remove();\r\n    });\r\n\r\n    const svg2 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"svg\");\r\n    svg2.setAttribute(\"width\", \"24\");\r\n    svg2.setAttribute(\"height\", \"24\");\r\n    svg2.setAttribute(\"viewBox\", \"0 0 28 22\");\r\n\r\n    const line3 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line3.setAttribute(\"x1\", \"2.41421\");\r\n    line3.setAttribute(\"y1\", \"1.88596\");\r\n    line3.setAttribute(\"x2\", \"21.114\");\r\n    line3.setAttribute(\"y2\", \"20.5858\");\r\n    line3.setAttribute(\"stroke\", \"#6A4040\");\r\n    line3.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    const line4 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n    line4.setAttribute(\"x1\", \"2.23007\");\r\n    line4.setAttribute(\"y1\", \"20.3978\");\r\n    line4.setAttribute(\"x2\", \"21.0421\");\r\n    line4.setAttribute(\"y2\", \"1.58577\");\r\n    line4.setAttribute(\"stroke\", \"#6A4040\");\r\n    line4.setAttribute(\"stroke-width\", \"4\");\r\n\r\n    svg2.appendChild(line3);\r\n    svg2.appendChild(line4);\r\n    button2.appendChild(svg2);\r\n\r\n    friendContainer.appendChild(img);\r\n    friendContainer.appendChild(label);\r\n    friendContainer.appendChild(containerActions);\r\n\r\n    if(!ownRequest) {\r\n        // checkmark\r\n        const button1 = document.createElement(\"button\");\r\n        button1.addEventListener(\"click\", () => {\r\n            (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/accept-friend-request\", { id: userData.id }, \"POST\");\r\n            friendContainer.remove();\r\n        });\r\n\r\n        const svg1 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"svg\");\r\n        svg1.setAttribute(\"width\", \"21\");\r\n        svg1.setAttribute(\"height\", \"17\");\r\n        svg1.setAttribute(\"viewBox\", \"0 0 21 17\");\r\n        \r\n        const line1 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n        line1.setAttribute(\"x1\", \"1.34874\");\r\n        line1.setAttribute(\"y1\", \"8.52322\");\r\n        line1.setAttribute(\"x2\", \"8.95535\");\r\n        line1.setAttribute(\"y2\", \"15.4703\");\r\n        line1.setAttribute(\"stroke\", \"#4E6A40\");\r\n        line1.setAttribute(\"stroke-width\", \"4\");\r\n        \r\n        const line2 = document.createElementNS(\"http://www.w3.org/2000/svg\", \"line\");\r\n        line2.setAttribute(\"x1\", \"8.58579\");\r\n        line2.setAttribute(\"y1\", \"12.9263\");\r\n        line2.setAttribute(\"x2\", \"19.1924\");\r\n        line2.setAttribute(\"y2\", \"2.31967\");\r\n        line2.setAttribute(\"stroke\", \"#4E6A40\");\r\n        line2.setAttribute(\"stroke-width\", \"4\");\r\n        \r\n        svg1.appendChild(line1);\r\n        svg1.appendChild(line2);\r\n        button1.appendChild(svg1);\r\n\r\n        containerActions.appendChild(button1);\r\n    }\r\n    containerActions.appendChild(button2);\r\n\r\n    document.getElementById(\"pending-list\").appendChild(friendContainer);\r\n}\r\n\r\nfunction removeFriend(id) {\r\n    if(document.getElementById(\"friend-\" + id)) document.getElementById(\"friend-\" + id).remove();\r\n}\r\n\r\nfunction removeFriendRequest(id) {\r\n    if(document.getElementById(\"request-\" + id)) document.getElementById(\"request-\" + id).remove();\r\n}\r\n\r\nfunction addGuild(GuildID) {\r\n    const imgElement = document.createElement('img');\r\n    imgElement.classList.add(\"guildlist-logo\");\r\n    imgElement.src = \"./images/logo_transparent.png\";\r\n\r\n    document.getElementById(\"guild-list\").appendChild(imgElement);\r\n}\r\n\r\nfunction addMessage(messageData) {\r\n    var messageContainer = document.createElement(\"div\");\r\n    messageContainer.className = \"message-container\";\r\n\r\n    var img = document.createElement(\"img\");\r\n    img.src = messageData.author.pfpURL;\r\n    img.width = 45;\r\n    img.height = 45;\r\n\r\n    var authorDiv = document.createElement(\"div\");\r\n    authorDiv.className = \"message-author\";\r\n\r\n    var usernameLabel = document.createElement(\"label\");\r\n    usernameLabel.textContent = messageData.author.username;\r\n\r\n    var timestampLabel = document.createElement(\"label\");\r\n    timestampLabel.textContent = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.formatTimestamp)(messageData.creationTime);\r\n\r\n    var messageGroupDiv = document.createElement(\"div\");\r\n    messageGroupDiv.className = \"message-group\";\r\n\r\n    authorDiv.appendChild(usernameLabel);\r\n    authorDiv.appendChild(timestampLabel);\r\n\r\n    if(messageData.content) {\r\n        var messageLabel = document.createElement(\"label\");\r\n        messageLabel.textContent = messageData.content;\r\n\r\n        messageGroupDiv.appendChild(messageLabel);\r\n    }\r\n\r\n    if(messageData.attachments && messageData.attachments.length > 0) {\r\n        messageData.attachments.forEach(attachment => {\r\n            if(/\\.(jpeg|jpg|gif|png)$/.test(attachment.url)) {\r\n                var attachmentImg = document.createElement(\"img\");\r\n                attachmentImg.src = attachment.url;\r\n                attachmentImg.style.maxWidth = \"520px\";\r\n                attachmentImg.style.maxHeight = \"260px\";\r\n                attachmentImg.style.marginTop = \"3px\";\r\n                messageGroupDiv.appendChild(attachmentImg);\r\n            } else {\r\n                // For non-image attachments or other future implementations\r\n                var attachmentLink = document.createElement(\"a\");\r\n                attachmentLink.href = attachment.url;\r\n                attachmentLink.textContent = attachment.filename;\r\n                attachmentLink.style.marginTop = \"3px\";\r\n                messageGroupDiv.appendChild(attachmentLink);\r\n            }\r\n        });\r\n    }\r\n\r\n    messageContainer.appendChild(img);\r\n    messageContainer.appendChild(authorDiv);\r\n    messageContainer.appendChild(messageGroupDiv);\r\n\r\n    document.getElementById(\"dm-messages\").appendChild(messageContainer);\r\n}\r\n\r\nfunction updateProfile() {\r\n    const profile = document.querySelectorAll(\"#side-user-menu label\");\r\n\r\n    profile[0].innerText = StealthNet.connection.user.username;\r\n    profile[2].innerText = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.formatTimestamp)(StealthNet.connection.user.creationTime);\r\n\r\n    document.querySelector(\"#side-user-menu img\").src = StealthNet.connection.user.pfpURL;\r\n\r\n    StealthNet.connection.user.friends.forEach(async userData => {\r\n        addFriend(userData);\r\n    });\r\n\r\n    StealthNet.connection.user.friendRequests.forEach(userData => {\r\n        addPendingRequest(userData, false);\r\n    });\r\n    \r\n    StealthNet.connection.user.friendRequestsOwn.forEach(userData => {\r\n        addPendingRequest(userData, true);\r\n    });\r\n}\r\n\r\ndocument.getElementById(\"friend-add\").addEventListener(\"click\", async () => {\r\n    const userData = await (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/add-friend\", { username: document.getElementById(\"friend-username\").value }, \"POST\");\r\n\r\n    if(userData)\r\n        addPendingRequest(userData, true);\r\n});\r\n\r\nfunction enterAction(text, attachments = []) {\r\n    addMessage({\r\n        author: { username: StealthNet.connection.user.username, pfpURL: StealthNet.connection.user.pfpURL },\r\n        content: text,\r\n        creationTime: Date.now(),\r\n        attachments: attachments // Add this line\r\n    });\r\n    document.getElementById(\"user-message-content\").value = ''; // Clear the input field\r\n    // Auto-scroll to the bottom of the message container\r\n    const messageContainer = document.getElementById(\"dm-messages\");\r\n    messageContainer.scrollTop = messageContainer.scrollHeight;\r\n}\r\n\r\nfunction isdmChat() {\r\n    return document.querySelector(\"div.dm-user\").hidden === false;\r\n}\r\n\r\nfunction getRecipientID() {\r\n    const activeFriendContainer = document.querySelector(\"#dm-list > .friend-container[state='active']\");\r\n    return activeFriendContainer ? activeFriendContainer.getAttribute('id') : null;\r\n}\r\n\r\ndocument.getElementById(\"user-message-content\").addEventListener(\"keydown\", event => {\r\n    if (event.key === \"Enter\" && !event.shiftKey && isdmChat()) {\r\n        event.preventDefault();\r\n        const messageContent = document.getElementById(\"user-message-content\").value.trim();\r\n\r\n        if (messageContent) {\r\n            const recipientId = getRecipientID();\r\n\r\n            if (recipientId) {\r\n                (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/send-message\", { recipientId, text: messageContent }, \"POST\")\r\n                    .then(() => enterAction(messageContent))\r\n                    .catch(error => console.error(\"Error sending message:\", error));\r\n            }\r\n        }\r\n    }\r\n});\r\n\r\ndocument.getElementById(\"dm-send-message\").addEventListener(\"click\", event => {\r\n    event.preventDefault();\r\n    if (isdmChat()) {\r\n        const messageContent = document.getElementById(\"user-message-content\").value.trim();\r\n\r\n        if (messageContent) {\r\n            const recipientId = getRecipientID();\r\n\r\n            if (recipientId) {\r\n                (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.postData)(\"/user-api/v1/send-message\", { recipientId, text: messageContent }, \"POST\")\r\n                    .then(() => enterAction(messageContent))\r\n                    .catch(error => console.error(\"Error sending message:\", error));\r\n            }\r\n        }\r\n    }\r\n});\r\n\r\nconst subTabContents = document.querySelectorAll('[class^=\"midsubtab-\"]');\r\nconst tabContents = document.querySelectorAll(\"#menu-mid > div\");\r\nconst tabButtons = document.querySelectorAll(\".mid-tabbutton\");\r\nconst lsideButtons = document.querySelectorAll(\".lside-button\");\r\n\r\ntabButtons.forEach(button => {\r\n    button.addEventListener(\"click\", () => {\r\n        const tabValue = button.getAttribute(\"tab\");\r\n\r\n        tabButtons.forEach(_button => {\r\n            _button.removeAttribute(\"state\");\r\n        });\r\n\r\n        button.setAttribute(\"state\", \"active\");\r\n\r\n        subTabContents.forEach(content => {\r\n            content.hidden = true;\r\n        });\r\n\r\n        const selectedTabContent = document.querySelector(`.midsubtab-${tabValue}`);\r\n        if(selectedTabContent) selectedTabContent.hidden = false;\r\n    });\r\n});\r\n\r\nlsideButtons.forEach(lsideButton => {\r\n    lsideButton.addEventListener(\"click\", function () {\r\n        const tabValue = lsideButton.getAttribute(\"tab\");\r\n\r\n        lsideButtons.forEach(_button => {\r\n            _button.removeAttribute(\"state\");\r\n        });\r\n\r\n        document.querySelectorAll(\"#dm-list > div\").forEach(_dm => {\r\n            _dm.removeAttribute(\"state\");\r\n        });\r\n\r\n        document.getElementById(\"dm-messages\").innerHTML = '';\r\n\r\n        lsideButton.setAttribute(\"state\", \"active\");\r\n\r\n        tabContents.forEach(content => {\r\n            content.hidden = true;\r\n        });\r\n\r\n        const selectedTabContent = document.querySelector(`.midtab-${tabValue}`);\r\n        if(selectedTabContent) selectedTabContent.hidden = false;\r\n    });\r\n});\r\n\r\nfunction switchMenu(menuType) {\r\n    const userMenu = document.querySelectorAll('.side-user-menu');\r\n    const serverMenu = document.querySelectorAll('.side-server-menu');\r\n\r\n    userMenu.forEach(menu => menu.style.display = menuType === 'user' ? 'block' : 'none');\r\n    serverMenu.forEach(menu => menu.style.display = menuType === 'server' ? 'block' : 'none');\r\n}\r\n\r\ndocument.getElementById(\"dm-attachfile\").addEventListener(\"click\", () => {\r\n    document.getElementById(\"file-input\").click();\r\n});\r\n\r\ndocument.getElementById(\"file-input\").addEventListener(\"change\", function() {\r\n    const file = this.files[0];\r\n    if (file) {\r\n        const formData = new FormData();\r\n        formData.append(\"file\", file);\r\n        formData.append(\"recipientId\", getRecipientID());\r\n\r\n        fetch(\"/user-api/v1/upload-file\", {\r\n            method: \"POST\",\r\n            body: formData,\r\n        })\r\n        .then(response => response.json())\r\n        .then(data => {\r\n            enterAction(null, [data.file]); // Pass null for text and the file data as attachments\r\n        })\r\n        .catch(error => console.error(\"Error uploading file:\", error));\r\n    }\r\n});\r\n\r\ndocument.getElementById(\"dm-messages\").addEventListener(\"scroll\", async function() {\r\n    if(this.scrollTop === 0) {\r\n        await loadMoreMessages();\r\n    }\r\n});\r\n\r\nfunction loadInitialMessages(recipientId) {\r\n    fetch(`/user-api/v1/get-messages?recipientId=${recipientId}&start=0&end=20`)\r\n        .then(response => response.json())\r\n        .then(data => {\r\n            if (data.messages) {\r\n                // Messages are sorted oldest to newest\r\n                data.messages.forEach(message => addMessage(message));\r\n                // Scroll to the bottom to show the most recent messages\r\n                const messageContainer = document.getElementById(\"dm-messages\");\r\n                messageContainer.scrollTop = messageContainer.scrollHeight;\r\n            }\r\n        })\r\n        .catch(error => console.error(\"Error loading messages:\", error));\r\n}\r\n\r\nasync function loadMoreMessages() {\r\n    const currentMessagesCount = document.querySelectorAll(\".message-container\").length;\r\n    const recipientId = getRecipientID();\r\n    if (recipientId) {\r\n        const oldScrollHeight = document.getElementById(\"dm-messages\").scrollHeight;\r\n        const response = await fetch(`/user-api/v1/get-messages?recipientId=${recipientId}&start=${currentMessagesCount}&end=${currentMessagesCount + 20}`);\r\n        const data = await response.json();\r\n        if(data.messages) {\r\n            data.messages.forEach(message => {\r\n                addMessageAtTop(message);\r\n            });\r\n        }\r\n        const newScrollHeight = document.getElementById(\"dm-messages\").scrollHeight;\r\n        document.getElementById(\"dm-messages\").scrollTop += newScrollHeight - oldScrollHeight;\r\n        if(!data.hasMore) {\r\n            document.getElementById(\"dm-messages\").removeEventListener(\"scroll\", loadMoreMessages);\r\n        }\r\n    }\r\n}\r\n\r\nfunction addMessageAtTop(messageData) {\r\n    var messageContainer = document.createElement(\"div\");\r\n    messageContainer.className = \"message-container\";\r\n\r\n    var img = document.createElement(\"img\");\r\n    img.src = messageData.author.pfpURL;\r\n    img.width = 45;\r\n    img.height = 45;\r\n\r\n    var authorDiv = document.createElement(\"div\");\r\n    authorDiv.className = \"message-author\";\r\n\r\n    var usernameLabel = document.createElement(\"label\");\r\n    usernameLabel.textContent = messageData.author.username;\r\n\r\n    var timestampLabel = document.createElement(\"label\");\r\n    timestampLabel.textContent = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.formatTimestamp)(messageData.creationTime);\r\n\r\n    var messageGroupDiv = document.createElement(\"div\");\r\n    messageGroupDiv.className = \"message-group\";\r\n\r\n    authorDiv.appendChild(usernameLabel);\r\n    authorDiv.appendChild(timestampLabel);\r\n\r\n    if(messageData.content) {\r\n        var messageLabel = document.createElement(\"label\");\r\n        messageLabel.textContent = messageData.content;\r\n\r\n        messageGroupDiv.appendChild(messageLabel);\r\n    }\r\n\r\n    if(messageData.attachments && messageData.attachments.length > 0) {\r\n        messageData.attachments.forEach(attachment => {\r\n            if(/\\.(jpeg|jpg|gif|png)$/.test(attachment.url)) {\r\n                var attachmentImg = document.createElement(\"img\");\r\n                attachmentImg.src = attachment.url;\r\n                attachmentImg.style.maxWidth = \"520px\";\r\n                attachmentImg.style.maxHeight = \"260px\";\r\n                attachmentImg.style.marginTop = \"3px\";\r\n                messageGroupDiv.appendChild(attachmentImg);\r\n            } else {\r\n                // For non-image attachments or other future implementations\r\n                var attachmentLink = document.createElement(\"a\");\r\n                attachmentLink.href = attachment.url;\r\n                attachmentLink.textContent = attachment.filename;\r\n                attachmentLink.style.marginTop = \"3px\";\r\n                messageGroupDiv.appendChild(attachmentLink);\r\n            }\r\n        });\r\n    }\r\n\r\n    messageContainer.appendChild(img);\r\n    messageContainer.appendChild(authorDiv);\r\n    messageContainer.appendChild(messageGroupDiv);\r\n\r\n    const dmMessages = document.getElementById(\"dm-messages\");\r\n    dmMessages.insertBefore(messageContainer, dmMessages.firstChild);\r\n}\n\n//# sourceURL=webpack://stealthnet-server/./webpack/mainpage/frontend.js?");

/***/ }),

/***/ "./webpack/mainpage/index.js":
/*!***********************************!*\
  !*** ./webpack/mainpage/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _frontend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./frontend.js */ \"./webpack/mainpage/frontend.js\");\n/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client.js */ \"./webpack/mainpage/client.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ \"./webpack/mainpage/util.js\");\n\r\n\r\n\r\nconst cookies = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.parseCookies)();\r\n\r\nwindow.StealthNet = {\r\n    cookie: cookies,\r\n    connection: new _client_js__WEBPACK_IMPORTED_MODULE_1__.Connection({ token: cookies.token || null })\r\n}\r\n\r\nconst socket = StealthNet.connection.net.socket;\r\nStealthNet.connection.on(\"fetchedProfile\", _frontend_js__WEBPACK_IMPORTED_MODULE_0__.updateProfile);\r\n\r\nsocket.on(\"friendRemove\", id => (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.removeFriend)(id));\r\nsocket.on(\"friendRequest\", userData => (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.addPendingRequest)(userData, false));\r\nsocket.on(\"friendRequestCancel\", userData => (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.removeFriendRequest)(userData.id));\r\nsocket.on(\"friendRequestAccept\", userData => (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.addFriend)(userData));\r\nsocket.on(\"newMessage\", messageData => (0,_frontend_js__WEBPACK_IMPORTED_MODULE_0__.addMessage)(messageData));\r\nsocket.on(\"statusChanged\", (id, type) => document.getElementById(\"friend-\" + id).querySelector('div.friend-status').setAttribute(\"state\", type));\n\n//# sourceURL=webpack://stealthnet-server/./webpack/mainpage/index.js?");

/***/ }),

/***/ "./webpack/mainpage/util.js":
/*!**********************************!*\
  !*** ./webpack/mainpage/util.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatTimestamp: () => (/* binding */ formatTimestamp),\n/* harmony export */   getData: () => (/* binding */ getData),\n/* harmony export */   parseCookies: () => (/* binding */ parseCookies),\n/* harmony export */   postData: () => (/* binding */ postData)\n/* harmony export */ });\nfunction parseCookies() {\r\n    var cookies = document.cookie.split(';');\r\n    var cookieObject = {};\r\n\r\n    cookies.forEach(function (cookie) {\r\n        var parts = cookie.split('=');\r\n        var key = parts[0].trim();\r\n        var value = decodeURIComponent(parts[1]);\r\n        cookieObject[key] = value;\r\n    });\r\n\r\n    return cookieObject;\r\n}\r\n\r\nfunction formatTimestamp(timestamp) {\r\n    const date = new Date(timestamp);\r\n  \r\n    const year = date.getFullYear();\r\n    const month = String(date.getMonth() + 1).padStart(2, '0');\r\n    const day = String(date.getDate()).padStart(2, '0');\r\n    \r\n    const hours = String(date.getHours()).padStart(2, '0');\r\n    const minutes = String(date.getMinutes()).padStart(2, '0');\r\n    const seconds = String(date.getSeconds()).padStart(2, '0');\r\n  \r\n    return `[${year}-${month}-${day}] ${hours}:${minutes}:${seconds}`;\r\n}\r\n\r\nasync function getData(url) {\r\n    return new Promise((resolve, reject) => {\r\n        var xhr = new XMLHttpRequest();\r\n\r\n        xhr.open(\"GET\", url, true);\r\n\r\n        xhr.onload = () => {\r\n            if(xhr.status >= 200 && xhr.status < 300) {\r\n                let jsonResponse;\r\n\r\n                try {\r\n                    jsonResponse = JSON.parse(xhr.responseText);\r\n                } catch(error) {\r\n                    resolve(xhr.responseText);\r\n                    return;\r\n                }\r\n\r\n                resolve(jsonResponse);\r\n            } else {\r\n                reject(new Error(`HTTP Error: ${xhr.status}`));\r\n            }\r\n        }\r\n\r\n        xhr.onerror = () => {\r\n            reject(new Error('Network request failed'));\r\n        }\r\n\r\n        xhr.send();\r\n    });\r\n}\r\n\r\nasync function postData(url, data, method) {\r\n    return new Promise((resolve, reject) => {\r\n        var xhr = new XMLHttpRequest();\r\n\r\n        xhr.open(method, url, true);\r\n\r\n        xhr.onload = () => {\r\n            if(xhr.status >= 200 && xhr.status < 300) {\r\n                let jsonResponse;\r\n\r\n                try {\r\n                    jsonResponse = JSON.parse(xhr.responseText);\r\n                } catch(error) {\r\n                    resolve(xhr.responseText);\r\n                    return;\r\n                }\r\n\r\n                resolve(jsonResponse);\r\n            } else {\r\n                reject(new Error(`HTTP Error: ${xhr.status}`));\r\n            }\r\n        }\r\n\r\n        xhr.onerror = () => {\r\n            reject(new Error('Network request failed'));\r\n        }\r\n\r\n        const requestData = typeof data === 'object' ? JSON.stringify(data) : data;\r\n\r\n        if(typeof data === \"object\")\r\n            xhr.setRequestHeader(\"Content-Type\", \"application/json;charset=UTF-8\");\r\n        if(typeof data === \"string\")\r\n            xhr.setRequestHeader(\"Content-Type\", \"text/plain;charset=UTF-8\");\r\n\r\n        xhr.send(requestData);\r\n    });\r\n}\n\n//# sourceURL=webpack://stealthnet-server/./webpack/mainpage/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./webpack/mainpage/index.js");
/******/ 	
/******/ })()
;