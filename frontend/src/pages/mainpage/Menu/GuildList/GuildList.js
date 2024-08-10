import "./GuildList.css";
import React, { useState } from "react";
import GuildPopup from "../GuildPopup/Popup";

function AddServerButton({ onClick }) {
  return (
    <button id="add-server" onClick={onClick}>
      <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="brightness-effect">
        <rect x="0.5" y="0.5" width="57" height="57" rx="4.5" fill="#1D1D2F" stroke="#131320"/>
        <path d="M29 12.8889V29M29 45.1111V29M29 29H45.1111M29 29H12.8889" stroke="#40446A" strokeWidth="2"/>
      </svg>
    </button>
  );
}

function GuildList() {
  const [showGuildPopup, setShowGuildPopup] = useState(false);

  const handleAddServerClick = () => {
    setShowGuildPopup(true);
  };

  const handleClosePopup = () => {
    setShowGuildPopup(false);
  };

  return (
    <div className="guild-list">
      <img className="guildlist-logo" src="/static/img/logo_transparent.png" alt="Guild Logo" />
      <hr />
      <div id="guild-list"></div>
      <AddServerButton onClick={handleAddServerClick} />
      {showGuildPopup && <GuildPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default GuildList;