import React, { useState } from 'react';
import { FriendsProvider } from './Friends/FriendsContext';
import TabButton from "./TabButton";
import Friends from "./Friends/Friends";
import PendingRequests from "./PendingRequests/PendingRequests";
import Direct from "./Direct/DirectMessages";
import { t } from "../../../../../localization/i18n"

function Home() {
    const [activeTab, setActiveTab] = useState('Friends');

    return (
        <FriendsProvider>
            <div style={{ padding: '0.5rem' }}>
                <div className="menucontent-tablist" style={{ paddingBottom: '0.5rem' }}>
                    <TabButton name={t("Friends")} active={activeTab === "Friends"} onClick={() => setActiveTab("Friends")} />
                    <TabButton name={t("Pending requests")} active={activeTab === "Pending requests"} onClick={() => setActiveTab("Pending requests")} />
                </div>
                <div>
                    {activeTab === "Friends" && <Friends />}
                    {activeTab === "Pending requests" && <PendingRequests />}
                    {activeTab === "Direct" && <Direct />}
                </div>
            </div>
        </FriendsProvider>
    );
}

export default Home;