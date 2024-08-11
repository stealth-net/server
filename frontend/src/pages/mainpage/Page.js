import GuildSidebar from './Menu/GuildSidebar/GuildSidebar';
import LeftMenu from './Menu/LeftMenu/LeftMenu';
import Content from './Menu/Content';
import RightMenu from './Menu/RightMenu/RightMenu';
import { useState } from 'react';
import socket from './Network/socket';
import { getData } from './Utils';
import events from './events';
import { DMProvider } from './Menu/Content/Home/Direct/DMContext';

function App() {
	const [activeTab, setActiveTab] = useState({ tab: "Home", params: {} });
	const [rightMenuContent, setRightMenuContent] = useState("Profile");

	socket.connect();

	getData("/user-api/v1/get-me").then(response => {
		window.user = response;
		events.emit("fetchedProfile", response);
	});

	return (
		<DMProvider>
			<>
				<GuildSidebar />
				<LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />
				{activeTab.tab === "DirectMessages" ? <Content activeTab={activeTab} userId={activeTab.params.userId} /> : <Content activeTab={activeTab} />}
				<RightMenu rightMenuContent={rightMenuContent} />
			</>
		</DMProvider>
	);
}

export default App;