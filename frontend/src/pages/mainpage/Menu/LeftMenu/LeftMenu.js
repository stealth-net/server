import "./LeftMenu.css";
import React from "react";
import TabButton from "./TabButton";
import { useDM } from '../Content/Home/Direct/DMContext';
import Avatar from "../../Components/Avatar";
import config from "../../Components/Config";

function LeftMenu({ setActiveTab, activeTab }) {
	const { dmList } = useDM();
	const reducedAnimations = config.getValue("reduced-animations");

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
				state={activeTab.tab === "Home" ? 'active' : ''}
				onClick={() => handleTabChange("Home")}
				className={reducedAnimations ? '' : 'animated'}
			/>
			<TabButton
				name="Settings"
				state={activeTab.tab === "Settings" ? 'active' : ''}
				onClick={() => handleTabChange("Settings")}
				className={reducedAnimations ? '' : 'animated'}
			/>
			<div className="menu-separator">
				<label>Direct Messages</label>
			</div>
			<div id="dm-list">
				{dmList.map(dm => (
					<div key={dm.id} className="friend-container" onClick={() => handleTabChange("DirectMessages", { userId: dm.id })}>
						<Avatar pfpURL={dm.pfpURL} status={dm.status} width="46" height="46" />
						<label>{dm.username}</label>
					</div>
				))}
			</div>
		</div>
	);
}

export default React.memo(LeftMenu);