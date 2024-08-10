import "./LeftMenu.css";
import React, { useState, useCallback } from "react";
import TabButton from "./TabButton";
import { useDM } from '../Content/Home/Direct/DMContext';
import Avatar from "../../Components/Avatar";
import config from "../../Components/Config";
import { t } from "../../../../localization/i18n"

function LeftMenu({ setActiveTab, activeTab }) {
	const { dmList, pinDM, closeDM } = useDM();
	const reducedAnimations = config.getValue("reduced-animations");
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, dmId: null });
	const handleTabChange = (newTab, params = {}) => {
		if (activeTab.tab === newTab && activeTab.params.userId === params.userId) {
			return;
		}
		setActiveTab({ tab: newTab, params });
	};
	const handleContextMenu = useCallback((e, dmId) => {
		e.preventDefault();
		setContextMenu({ visible: true, x: e.clientX, y: e.clientY, dmId });
	}, []);
	const handleContextMenuAction = useCallback((action) => {
		if (action === 'pin') {
			pinDM(contextMenu.dmId);
		} else if (action === 'close') {
			closeDM(contextMenu.dmId);
		}
		setContextMenu({ visible: false, x: 0, y: 0, dmId: null });
	}, [contextMenu.dmId, pinDM, closeDM]);
	const closeContextMenu = useCallback(() => {
		setContextMenu({ visible: false, x: 0, y: 0, dmId: null });
	}, []);

	return (
		<div className="side-menu-left" onClick={closeContextMenu}>
			<TabButton
				name={t("Home")}
				state={activeTab.tab === "Home" ? 'active' : ''}
				onClick={() => handleTabChange("Home")}
				className={reducedAnimations ? '' : 'animated'}
			/>
			<TabButton
				name={t("Settings")}
				state={activeTab.tab === "Settings" ? 'active' : ''}
				onClick={() => handleTabChange("Settings")}
				className={reducedAnimations ? '' : 'animated'}
			/>
			<div className="menu-separator">
				<label>{t("Direct Messages")}</label>
			</div>
			<div id="dm-list">
				{dmList.map(dm => (
					<div
						key={dm.id}
						className="friend-container"
						onClick={() => handleTabChange("DirectMessages", { userId: dm.id })}
						onContextMenu={(e) => handleContextMenu(e, dm.id)}
						state={activeTab.tab === "DirectMessages" && activeTab.params.userId === dm.id ? 'active' : ''}
					>
						<Avatar pfpURL={dm.pfpURL} status={dm.status} width="46" height="46" />
						<label>{dm.username}</label>
					</div>
				))}
			</div>
			{contextMenu.visible && (
				<div
					className={`context-menu ${reducedAnimations ? '' : 'animated'}`}
					style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, opacity: 1, transform: 'none' }}
					onClick={(e) => e.stopPropagation()}
				>
					<button onClick={() => handleContextMenuAction('pin')}>{t("Pin DM")}</button>
					<button onClick={() => handleContextMenuAction('close')}>{t("Close DM")}</button>
				</div>
			)}
		</div>
	);
}

export default React.memo(LeftMenu);