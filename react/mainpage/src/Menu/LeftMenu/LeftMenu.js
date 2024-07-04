import "./LeftMenu.css";
import React from "react";
import TabButton from "./TabButton";

function LeftMenu({ setActiveTab, activeTab }) {
	const handleTabChange = (newTab) => {
		setActiveTab(newTab);
	};

	return (
		<div className="side-menu-left">
			<TabButton
				name="Home"
				className={activeTab === "Home" ? 'active' : ''}
				onClick={() => handleTabChange("Home")}
			/>
			<TabButton
				name="Settings"
				className={activeTab === "Settings" ? 'active' : ''}
				onClick={() => handleTabChange("Settings")}
			/>
			<div class="menu-separator">
				<label>Direct Messages</label>
			</div>
			<div id="dm-list"></div>
		</div>
	);
}

export default React.memo(LeftMenu);