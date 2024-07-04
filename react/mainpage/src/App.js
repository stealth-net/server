import GuildList from './Menu/GuildList/GuildList';
import LeftMenu from './Menu/LeftMenu/LeftMenu';
import Content from './Menu/Content';
import RightMenu from './Menu/RightMenu/RightMenu';
import { useState } from 'react';
import socket from './Network/socket';
import { getData } from './Utils';
import events from './events';

function App() {
	const [activeTab, setActiveTab] = useState("Home");
	const [rightMenuContent, setRightMenuContent] = useState("Profile");

	socket.connect();

	getData("/user-api/v1/get-me").then(response => {
		window.user = response;
		events.emit("fetchedProfile", response);
	});

	return (
		<>
			<GuildList />
			<LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />
			<Content activeTab={activeTab} />
			<RightMenu rightMenuContent={rightMenuContent} />
		</>
	);
}

export default App;