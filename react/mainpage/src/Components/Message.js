import React from "react";
import "./Message.css";
import "./Attachment.css";
import { formatTimestamp, formatMessage } from "../Utils";
import config from "./Config";
import MessageActions from "./MessageActions";

function Message({ messageData }) {
    const handleMouseEnter = (e) => {
        const shiftRequired = config.getValue("message-action-shift-require");
        if (shiftRequired && !e.shiftKey) return;
        e.currentTarget.querySelector(".message-actions").style.display = "flex";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.querySelector(".message-actions").style.display = "none";
    };

    return (
        <div className="message-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <MessageActions messageData={messageData} />
            <img src={messageData.author.pfpURL} alt={messageData.author.username} width="45" height="45" />
            <div className="message-author">
                <label>{messageData.author.username}</label>
                <label>{formatTimestamp(messageData.creationTime)}</label>
            </div>
            <div className="message-group">
                {messageData.content && <label dangerouslySetInnerHTML={{ __html: formatMessage(messageData.content) }} />}
                {messageData.attachments && messageData.attachments.map((attachment, index) => {
                    if (/\.(jpeg|jpg|gif|png)$/.test(attachment.url)) {
                        return <img key={index} src={attachment.url} alt="" style={{ maxWidth: "520px", maxHeight: "260px", marginTop: "3px" }} />;
                    } else {
                        return (
                            <div key={index} style={{ display: "inline-flex" }}>
                                <div className="attachment" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5 1H21L26 5.57895C26 6.9762 26 14.7368 26 14.7368M13.5 1H1V30H26V14.7368M13.5 1L21 9.39474L26 14.7368M4.33333 5.57895H12.6667M4.33333 10.1579H17.6667M4.33333 13.2105H14.3333M4.33333 16.2632H19.3333" stroke="#51567C" strokeWidth="2" />
                                    </svg>
                                </div>
                                <a href={attachment.url} download={attachment.filename} style={{ textDecoration: "underline", fontSize: "16px", marginLeft: "10px" }}>
                                    {attachment.filename}
                                </a>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default Message;