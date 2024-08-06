import "./GuildList.css";
import React from "react";

function GuildList() {
    return (
        <div className="guild-list">
            <img className="guildlist-logo" src="/static/img/logo_transparent.png" alt="Guild Logo" />
            <hr />
            <div id="guild-list"></div>

            <button id="add-server" style={{ width: '58px', height: '58px', position: 'absolute', bottom: '0', transform: 'translateX(calc(50% - 58px))', marginBottom: '3px', padding: '0', border: 'none' }}>
                <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="brightness-effect">
                    <rect x="0.5" y="0.5" width="57" height="57" rx="4.5" fill="#1D1D2F" stroke="#131320"/>
                    <path d="M29 12.8889V29M29 45.1111V29M29 29H45.1111M29 29H12.8889" stroke="#40446A" strokeWidth="2"/>
                </svg>
            </button>
        </div>
    );
}

export default GuildList;