import React, { useState } from 'react';
import { FriendsProvider } from './Friends/FriendsContext';
import TabButton from "./TabButton";
import Friends from "./Friends/Friends";
import PendingRequests from "./PendingRequests/PendingRequests";
import Direct from "./Direct/Direct";

function Home() {
    const [activeTab, setActiveTab] = useState('Friends');

    return (
        <FriendsProvider>
            <>
                <div className="menucontent-tablist" style={{paddingBottom: '10px'}}>
                    <TabButton name="Friends" active={activeTab === "Friends"} onClick={() => setActiveTab("Friends")} />
                    <TabButton name="Pending requests" active={activeTab === "Pending requests"} onClick={() => setActiveTab("Pending requests")} />
                </div>
                <div>
                    {activeTab === "Friends" && <Friends />}
                    {activeTab === "Pending requests" && <PendingRequests />}
                    {activeTab === "Direct" && <Direct />}
                </div>
            </>
        </FriendsProvider>
    );
}

export default Home;