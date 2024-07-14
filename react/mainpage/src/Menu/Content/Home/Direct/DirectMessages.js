import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import ChatInput from "../../../../Components/ChatInput";
import "./DirectMessages.css";
import "../../../../Components/Action.css";
import { postData } from "../../../../Utils";
import Message from "../../../../Components/Message";
import config from "../../../../Components/Config";
import socket from "../../../../Network/socket";

function AttachFileButton({ getRecipientId, onFileUpload }) {
    useEffect(() => {
        const attachFileButton = document.getElementById("dm-attach-file");
        const fileInput = document.getElementById("file-input");

        attachFileButton.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            const file = this.files[0];

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("recipientId", getRecipientId());

                fetch("/user-api/v1/upload-file", {
                    method: "POST",
                    body: formData,
                    headers: {
                        'save-attachments': config.getValue("save-attachments")
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        onFileUpload(data.file);
                    })
                    .catch(error => console.error("Error uploading file:", error));
            }
        });
    }, [getRecipientId, onFileUpload]);

    return (
        <>
            <button id="dm-attach-file" className="action brightness-effect">
                <svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 1H21L26 5.57895C26 6.9762 26 14.7368 26 14.7368M13.5 1H1V30H26V14.7368M13.5 1L21 9.39474L26 14.7368M4.33333 5.57895H12.6667M4.33333 10.1579H17.6667M4.33333 13.2105H14.3333M4.33333 16.2632H19.3333" stroke="#51567C" strokeWidth="2" />
                </svg>
            </button>
            <input type="file" id="file-input" hidden accept="*/*" />
        </>
    );
}

function SendMessageButton({ onClick }) {
    return (
        <button id="dm-send-message" className="action brightness-effect" onClick={onClick}>
            <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.75 13H29M29 13L3 3L9.5 13L3 23L29 13Z" stroke="#51567C" strokeWidth="2" />
            </svg>
        </button>
    );
}

function DirectMessages({ userId }) {
    const recipientId = userId;

    const addMessage = (messageData, onTop = false) => {
        const messageContainer = document.getElementById("dm-messages");
        const messageWrapper = document.createElement('div');
        const messageElement = React.createElement(Message, { messageData, className: "message-container", style: { marginBottom: config.getValue("space-between-messages") + "px" } });
        ReactDOM.createRoot(messageWrapper).render(messageElement);
        
        if (onTop) {
            messageContainer.insertBefore(messageWrapper, messageContainer.firstChild);
        } else {
            messageContainer.appendChild(messageWrapper);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    const handleEnterPress = (messageContent) => {
        if (messageContent.trim() !== "") {
            postData("/user-api/v1/send-message", { recipientId, text: messageContent, saveMessage: config.getValue("save-messages") }, "POST")
                .then(() => {
                    document.getElementById("chat-input").value = "";
                    addMessage({
                        author: {
                            username: window.user.username,
                            pfpURL: window.user.pfpURL
                        },
                        content: messageContent,
                        creationTime: new Date().toISOString()
                    });
                })
                .catch(error => console.error("Error sending message:", error));
        } else {
            console.error("Message content is empty");
        }
    };

    const handleFileUpload = (file) => {
        addMessage({
            author: {
                username: window.user.username,
                pfpURL: window.user.pfpURL
            },
            attachments: [file],
            creationTime: new Date().toISOString()
        });
    };

    const loadMoreMessages = useCallback(async () => {
        const currentMessagesCount = document.querySelectorAll(".message-container").length;
        if (recipientId) {
            try {
                const response = await fetch(`/user-api/v1/get-messages?recipientId=${recipientId}&start=${currentMessagesCount}&end=${currentMessagesCount + 20}`);
                if (!response.ok) {
                    throw new Error(`Error fetching messages: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.messages) {
                    ReactDOM.unstable_batchedUpdates(() => {
                        data.messages.reverse().forEach(message => {
                            addMessage(message, true);
                        });
                    });
                }
                if (!data.hasMore) {
                    document.getElementById("dm-messages").removeEventListener("scroll", loadMoreMessages);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [recipientId]);

    useEffect(() => {
        const dmMessages = document.getElementById("dm-messages");
        dmMessages.addEventListener("scroll", async function () {
            if (this.scrollTop === 0) {
                await loadMoreMessages();
            }
        });

        loadMoreMessages();

        socket.on("newMessage", messageData => addMessage(messageData));

        return () => {
            socket.off("newMessage");
        };
    }, [loadMoreMessages]);

    useEffect(() => {
        document.getElementById("dm-messages").scrollTop = document.getElementById("dm-messages").scrollHeight * 2; // Scroll to the bottom
    }, []);

    return (
        <>
            <div id="dm-messages" style={{ display: 'flex', flexDirection: 'column' }}></div>
            <div className="dm-bottom-bar">
                <AttachFileButton getRecipientId={() => recipientId} onFileUpload={handleFileUpload} />
                <ChatInput
                    inputId="chat-input"
                    placeholder="Type a message..."
                    onEnterPress={handleEnterPress}
                />
                {config.getValue("show-send-message-button") && <SendMessageButton onClick={() => handleEnterPress(document.getElementById("chat-input").value)} />}
            </div>
        </>
    );
}

export default DirectMessages;