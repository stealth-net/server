import React, { memo } from "react";
import Home from "./Content/Home/Home";
import Settings from "./Content/Settings";
import DirectMessages from "./Content/Home/Direct/DirectMessages";

function Content({ activeTab }) {
    return (
        <div className="menu-content">
            {activeTab.tab === 'Home' && <Home />}
            {activeTab.tab === 'Settings' && <Settings />}
            {activeTab.tab === 'DirectMessages' && <DirectMessages userId={activeTab.params.userId} />}
        </div>
    );
}

export default memo(Content);