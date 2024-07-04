import "./LeftMenu.css";
import React from "react";
import TabButton from "./TabButton.js";

function LeftMenu({ setActiveTab, activeTab }) {
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    <div className="side-menu-left">
      <TabButton 
        name="Home" 
        state={activeTab === "Home" ? 'active' : ''} 
        onClick={() => handleTabChange("Home")} 
      />
      <TabButton 
        name="Settings" 
        state={activeTab === "Settings" ? 'active' : ''} 
        onClick={() => handleTabChange("Settings")} 
      />
    </div>
  );
}

export default React.memo(LeftMenu);