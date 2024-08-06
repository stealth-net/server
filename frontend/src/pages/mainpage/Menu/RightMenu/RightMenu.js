import "./RightMenu.css";
import React from "react";
import Profile from "./Profile";
import Server from "./Server";

function RightMenu({ rightMenuContent }) {
    return (
        <div className="side-menu-right">
            {rightMenuContent === 'Server' && <Server />}
            {rightMenuContent === 'Profile' && <Profile />}
        </div>
    );
}

export default RightMenu;