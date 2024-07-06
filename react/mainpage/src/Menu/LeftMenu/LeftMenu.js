import "./LeftMenu.css";
import React from "react";
import TabButton from "./TabButton";
import { useDM } from '../Content/Home/Direct/DMContext';

function LeftMenu({ setActiveTab, activeTab }) {
    const { dmList } = useDM();

    const handleTabChange = (newTab, params = {}) => {
        if (activeTab.tab === newTab && activeTab.params.userId === params.userId) {
            return;
        }
        setActiveTab({ tab: newTab, params });
    };

    return (
        <div className="side-menu-left">
            <TabButton
                name="Home"
                className={activeTab.tab === "Home" ? 'active' : ''}
                onClick={() => handleTabChange("Home")}
            />
            <TabButton
                name="Settings"
                className={activeTab.tab === "Settings" ? 'active' : ''}
                onClick={() => handleTabChange("Settings")}
            />
            <div className="menu-separator">
                <label>Direct Messages</label>
            </div>
            <div id="dm-list">
                {dmList.map(dm => (
                    <div key={dm.id} className="friend-container" onClick={() => handleTabChange("DirectMessages", { userId: dm.id })}>
                        <img src={dm.pfpURL} alt={dm.username} width="46" height="46" />
                        <div className="friend-status" state={dm.status}></div>
                        <label>{dm.username}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(LeftMenu);