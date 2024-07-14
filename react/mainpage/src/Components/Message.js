import React, { useEffect, useState } from "react";
import "./Message.css";
import "./Attachment.css";
import { formatTimestamp, formatMessage, postData } from "../Utils";
import config from "./Config";

const MessageActions = ({ messageData, animationsEnabled }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(messageData.content);
    };

    const handlePin = () => {
        postData("/user-api/v1/pin-message", { id: messageData.id });
    };

    const handleCopyID = () => {
        navigator.clipboard.writeText(messageData.id);
    };

    const handleDelete = () => {
        postData("/user-api/v1/delete-message", { id: messageData.id });
    };

    const actions = [
        { name: "Copy", svg: <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.35821 3.07692H6.43284M8.37313 3.07692H10.3134M2.74627 5.15385H6.43284M8.37313 5.15385H11.0896M2.74627 7.46154H7.59701M9.53731 7.46154H12.6418M1 1V19H14V5.38462L10.3134 1H1Z" stroke="#51567C"/></svg>, onClick: handleCopy },
        { name: "Pin", svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7151 14.2954L0.773193 21.2L7.60824 11.1569M10.7151 14.2954L7.60824 11.1569M10.7151 14.2954L15.0647 18.6892L16.9288 12.4123L15.496 10.965M7.60824 11.1569L3.25867 6.76307L9.47235 4.87999L11.0258 6.44922M15.496 10.965L21.2783 7.07691L20.3463 4.87999L19.1036 2.99691L16.9288 1.42768L14.754 0.799988L11.0258 6.44922M15.496 10.965L11.0258 6.44922" stroke="#51567C"/></svg>, onClick: handlePin },
        { name: "Copy ID", svg: <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.82448 11.4445H0.432475V0.564458H1.82448V11.4445ZM3.62935 11.4445V0.564458H7.00535C8.25335 0.564458 9.21335 0.943124 9.88535 1.70046C10.5574 2.44712 10.8934 3.48179 10.8934 4.80446V7.18846C10.8934 8.52179 10.5574 9.56712 9.88535 10.3245C9.21335 11.0711 8.25335 11.4445 7.00535 11.4445H3.62935ZM6.97335 1.87646H5.02135V10.1485H6.97335C8.62668 10.1485 9.45335 9.16179 9.45335 7.18846V4.80446C9.45335 2.85246 8.62668 1.87646 6.97335 1.87646Z" fill="#51567C"/></svg>, onClick: handleCopyID },
        { name: "Delete", svg: <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.06929 2.16097L13.7764 2.16097L9.48378 2.16097H7.92284L5.97166 2.16097H2.06929Z" fill="#51567C"/><path d="M5.97166 2.16097L7.92284 2.16097H9.48378M5.97166 2.16097H2.06929L13.7764 2.16097L9.48378 2.16097M5.97166 2.16097V0.799988C7.34323 0.799988 8.11221 0.799988 9.48378 0.799988V2.16097M7.92284 8.48292L7.92284 12.1707V15.8585M11.435 9.00975V12.1707V15.3317M4.41071 9.00975V12.1707L4.41071 15.3317M2.84976 20.6L1.28882 3.74146L7.92284 3.74146L14.5569 3.74146L12.9959 20.6H7.92284H2.84976Z" stroke="#51567C"/></svg>, onClick: handleDelete }
    ];

    return (
        <div className="message-actions">
            {actions.map((action, index) => (
                <div key={index} className="message-action-button" onClick={action.onClick}>
                    {action.svg}
                    <div className={`tooltip ${animationsEnabled ? "animated" : ""}`}>{action.name}</div>
                </div>
            ))}
        </div>
    );
};

function Message({ messageData }) {
    const [animationsEnabled, setAnimationsEnabled] = useState(false);
    const [shiftRequired, setShiftRequired] = useState(false);

    useEffect(() => {
        setAnimationsEnabled(config.getValue("message-action-animations"));
        setShiftRequired(config.getValue("message-action-shift-require"));
    }, []);

    useEffect(() => {
        const handleConfigChange = () => {
            setAnimationsEnabled(config.getValue("message-action-animations"));
            setShiftRequired(config.getValue("message-action-shift-require"));
        };

        config.subscribe(handleConfigChange);

        return () => {
            config.unsubscribe(handleConfigChange);
        };
    }, []);

    const handleMouseEnter = (e) => {
        if (shiftRequired && !e.shiftKey) return;
        e.currentTarget.querySelector(".message-actions").style.display = "flex";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.querySelector(".message-actions").style.display = "none";
    };

    return (
        <div className="message-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <MessageActions messageData={messageData} animationsEnabled={animationsEnabled} />
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