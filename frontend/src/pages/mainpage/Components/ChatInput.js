import React, { useState } from 'react';

function ChatInput({ placeholder = "Placeholder...", onEnterPress, inputId = "chat-input" }) {
    const [content, setContent] = useState('');

    const handleChange = (e) => {
        const formattedContent = e.target.value
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\|\|(.*?)\|\|/g, '<span style="color: transparent; text-shadow: 0 0 8px rgba(0,0,0,0.5);">$1</span>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/__(.*?)__/g, '<u>$1</u>');

        setContent(formattedContent);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnterPress(content);
        }
    };

    return (
        <>
            <textarea
                id={inputId}
                className="message-content"
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{ width: "-webkit-fill-available" }}
            />
        </>
    );
}

export default ChatInput;