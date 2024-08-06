import "./MessageActions.css";
import { useState, useEffect } from "react";
import config from "./Config";
import { postData } from "../Utils";

const MessageActions = ({ messageData }) => {
    const [animationsEnabled, setAnimationsEnabled] = useState(false);

    useEffect(() => {
        setAnimationsEnabled(config.getValue("message-action-animations"));
    }, []);

    useEffect(() => {
        const handleConfigChange = () => {
            setAnimationsEnabled(config.getValue("message-action-animations"));
        };

        config.subscribe(handleConfigChange);

        return () => {
            config.unsubscribe(handleConfigChange);
        };
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(messageData.content);
    };

    const handlePin = () => {
        postData("/user-api/v1/pin-message", { id: messageData.id });
    };

    const handleCopyID = () => {
        navigator.clipboard.writeText(messageData.id);
    };

    const handleCopyAuthorID = () => {
        navigator.clipboard.writeText(messageData.author.id);
    };

    const handleDelete = () => {
        postData("/user-api/v1/delete-message", { id: messageData.id });
    };

    const actions = [
        { name: "Copy Message", onClick: handleCopy, svg: (
            <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.35821 3.07692H6.43284M8.37313 3.07692H10.3134M2.74627 5.15385H6.43284M8.37313 5.15385H11.0896M2.74627 7.46154H7.59701M9.53731 7.46154H12.6418M1 1V19H14V5.38462L10.3134 1H1Z" stroke="#51567C" />
            </svg>
        ) },
        { name: "Copy ID", onClick: handleCopyID, svg: (
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.82448 11.4445H0.432475V0.564458H1.82448V11.4445ZM3.62935 11.4445V0.564458H7.00535C8.25335 0.564458 9.21335 0.943124 9.88535 1.70046C10.5574 2.44712 10.8934 3.48179 10.8934 4.80446V7.18846C10.8934 8.52179 10.5574 9.56712 9.88535 10.3245C9.21335 11.0711 8.25335 11.4445 7.00535 11.4445H3.62935ZM6.97335 1.87646H5.02135V10.1485H6.97335C8.62668 10.1485 9.45335 9.16179 9.45335 7.18846V4.80446C9.45335 2.85246 8.62668 1.87646 6.97335 1.87646Z" fill="#51567C"/>
            </svg>
        ) },
        { name: "Copy Author ID", onClick: handleCopyAuthorID, svg: (
            <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.624002 0.564458H2.064V7.54046C2.064 8.41512 2.24534 9.09779 2.608 9.58846C2.98134 10.0791 3.55734 10.3245 4.336 10.3245C5.12534 10.3245 5.70134 10.0791 6.064 9.58846C6.42667 9.09779 6.608 8.41512 6.608 7.54046V0.564458H8.048V7.54046C8.048 8.80979 7.73867 9.80712 7.12 10.5325C6.50134 11.2471 5.57334 11.6045 4.336 11.6045C3.088 11.6045 2.15467 11.2471 1.536 10.5325C0.928002 9.80712 0.624002 8.80979 0.624002 7.54046V0.564458ZM11.015 11.4445H9.623V0.564458H11.015V11.4445ZM12.8199 11.4445V0.564458H16.1959C17.4439 0.564458 18.4039 0.943124 19.0759 1.70046C19.7479 2.44712 20.0839 3.48179 20.0839 4.80446V7.18846C20.0839 8.52179 19.7479 9.56712 19.0759 10.3245C18.4039 11.0711 17.4439 11.4445 16.1959 11.4445H12.8199ZM16.1639 1.87646H14.2119V10.1485H16.1639C17.8172 10.1485 18.6439 9.16179 18.6439 7.18846V4.80446C18.6439 2.85246 17.8172 1.87646 16.1639 1.87646Z" fill="#51567C"/>
            </svg>
        ) },
        { name: "Pin", onClick: handlePin, svg: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7151 14.2954L0.773193 21.2L7.60824 11.1569M10.7151 14.2954L7.60824 11.1569M10.7151 14.2954L15.0647 18.6892L16.9288 12.4123L15.496 10.965M7.60824 11.1569L3.25867 6.76307L9.47235 4.87999L11.0258 6.44922M15.496 10.965L21.2783 7.07691L20.3463 4.87999L19.1036 2.99691L16.9288 1.42768L14.754 0.799988L11.0258 6.44922M15.496 10.965L11.0258 6.44922" stroke="#51567C" />
            </svg>
        ) },
        { name: "Delete", onClick: handleDelete, svg: (
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.06929 2.16097L13.7764 2.16097L9.48378 2.16097H7.92284L5.97166 2.16097H2.06929Z" fill="#51567C" />
                <path d="M5.97166 2.16097L7.92284 2.16097H9.48378M5.97166 2.16097H2.06929L13.7764 2.16097L9.48378 2.16097M5.97166 2.16097V0.799988C7.34323 0.799988 8.11221 0.799988 9.48378 0.799988V2.16097M7.92284 8.48292L7.92284 12.1707V15.8585M11.435 9.00975V12.1707V15.3317M4.41071 9.00975V12.1707L4.41071 15.3317M2.84976 20.6L1.28882 3.74146L7.92284 3.74146L14.5569 3.74146L12.9959 20.6H7.92284H2.84976Z" stroke="#51567C" />
            </svg>
        ) },
    ];

    return (
        <div className={`message-actions ${animationsEnabled ? "animated" : ""}`}>
            {actions.map((action, index) => (
                <div key={index} className="message-action-button brightness-effect" onClick={action.onClick}>
                    {action.svg}
                    <div className={`tooltip ${animationsEnabled ? "animated" : ""}`}>{action.name}</div>
                </div>
            ))}
        </div>
    );
};

export default MessageActions;